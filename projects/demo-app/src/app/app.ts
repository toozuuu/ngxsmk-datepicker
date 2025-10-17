import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
  FormGroup
} from '@angular/forms';

// --- DATE UTILITY FUNCTIONS ---
function getStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function getEndOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function addMonths(d: Date, months: number): Date {
  const newDate = new Date(d);
  newDate.setMonth(d.getMonth() + months);
  return newDate;
}
function subtractDays(d: Date, days: number): Date {
  const newDate = new Date(d);
  newDate.setDate(d.getDate() - days);
  return newDate;
}
function getStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function getEndOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export type DateInput = Date | string | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

export type DatepickerValue = Date | { start: Date, end: Date } | null;


// --- 1. CUSTOM SELECT COMPONENT ---
@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ngxsmk-select-container" (click)="toggleDropdown()">
      <button type="button" class="ngxsmk-select-display" [disabled]="disabled">
        <span>{{ displayValue }}</span>
        <svg class="ngxsmk-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                d="M112 184l144 144 144-144"/>
        </svg>
      </button>
      @if (isOpen) {
        <div class="ngxsmk-options-panel">
          <ul>
            @for (option of options; track option.value) {
              <li [class.selected]="option.value === value" (click)="selectOption(option); $event.stopPropagation()">
                {{ option.label }}
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { position: relative; display: inline-block; }
    .ngxsmk-select-container { cursor: pointer; }
    .ngxsmk-select-display {
      display: flex; align-items: center; justify-content: space-between;
      width: var(--custom-select-width, 115px); background: var(--datepicker-background, #fff);
      border: 1px solid var(--datepicker-border-color, #ccc); color: var(--datepicker-text-color, #333);
      border-radius: 4px; padding: 4px 8px; font-size: 14px; text-align: left; height: 30px;
    }
    .ngxsmk-select-display:disabled {
      background-color: var(--datepicker-hover-background, #f0f0f0);
      cursor: not-allowed;
      opacity: 0.7;
    }
    .ngxsmk-arrow-icon { width: 12px; height: 12px; margin-left: 8px; }
    .ngxsmk-options-panel {
      position: absolute; top: 110%; left: 0; width: 100%;
      background: var(--datepicker-background, #fff); border: 1px solid var(--datepicker-border-color, #ccc);
      color: var(--datepicker-text-color, #333); border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-height: 200px; overflow-y: auto; z-index: 9999;
    }
    .ngxsmk-options-panel ul { list-style: none; padding: 4px; margin: 0; }
    .ngxsmk-options-panel li { padding: 8px 12px; border-radius: 4px; cursor: pointer; }
    .ngxsmk-options-panel li:hover { background-color: var(--datepicker-hover-background, #f0f0f0); }
    .ngxsmk-options-panel li.selected {
      background-color: var(--datepicker-primary-color, #3880ff); color: var(--datepicker-primary-contrast, #fff);
    }
  `],
})
export class CustomSelectComponent {
  @Input() options: { label: string; value: any }[] = [];
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<any>();
  public isOpen = false;

  private readonly elementRef: ElementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) this.isOpen = false;
  }

  get displayValue(): string {
    const selectedOption = this.options.find((opt) => opt.value === this.value);
    return selectedOption ? selectedOption.label : '';
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { label: string; value: any }): void {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.isOpen = false;
  }
}

// --- 2. DATE PICKER COMPONENT ---
@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent, DatePipe, ReactiveFormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: true
  }],
  template: `
    <div class="ngxsmk-datepicker-container">
      @if (showRanges && rangesArray.length > 0 && mode === 'range') {
        <div class="ngxsmk-ranges-container">
          <ul>
            @for (range of rangesArray; track range.key) {
              <li (click)="selectRange(range.value)" [class.disabled]="disabled">{{ range.key }}</li>
            }
          </ul>
        </div>
      }
      <div class="ngxsmk-calendar-container">
        <div class="ngxsmk-header">
          <div class="ngxsmk-month-year-selects">
            <app-custom-select class="month-select" [options]="monthOptions"
                               [(value)]="currentMonth" [disabled]="disabled"></app-custom-select>
            <app-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear" [disabled]="disabled"></app-custom-select>
          </div>
          <div class="ngxsmk-nav-buttons">
            <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(-1)" [disabled]="disabled">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                      d="M328 112L184 256l144 144"/>
              </svg>
            </button>
            <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(1)" [disabled]="disabled">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                      d="M184 112l144 144-144 144"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="ngxsmk-days-grid-wrapper">
          <div class="ngxsmk-days-grid">
            @for (day of weekDays; track day) {
              <div class="ngxsmk-day-name">{{ day }}</div>
            }
            @for (day of daysInMonth; track $index) {
              <div class="ngxsmk-day-cell"
                   [class.empty]="!day" [class.disabled]="isDateDisabled(day)" [class.today]="isSameDay(day, today)"
                   [class.selected]="mode === 'single' && isSameDay(day, selectedDate)"
                   [class.start-date]="mode === 'range' && isSameDay(day, startDate)"
                   [class.end-date]="mode === 'range' && isSameDay(day, endDate)"
                   [class.in-range]="mode === 'range' && isInRange(day)"
                   [class.preview-range]="isPreviewInRange(day)"
                   (click)="onDateClick(day)" (mouseenter)="onDateHover(day)">
                @if (day) {
                  <div class="ngxsmk-day-number">{{ day | date : 'd' }}</div>
                }
              </div>
            }
          </div>
        </div>

        @if (showTime) {
          <div class="ngxsmk-time-selection">
            <span class="ngxsmk-time-label">Time:</span>
            <app-custom-select
              class="hour-select"
              [options]="hourOptions"
              [(value)]="currentDisplayHour"
              (valueChange)="onTimeChange()"
              [disabled]="disabled"
            ></app-custom-select>
            <span class="ngxsmk-time-separator">:</span>
            <app-custom-select
              class="minute-select"
              [options]="minuteOptions"
              [(value)]="currentMinute"
              (valueChange)="onTimeChange()"
              [disabled]="disabled"
            ></app-custom-select>
            <app-custom-select
              class="ampm-select"
              [options]="ampmOptions"
              [(value)]="isPm"
              (valueChange)="onTimeChange()"
              [disabled]="disabled"
            ></app-custom-select>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    :host {
      --datepicker-primary-color: #6d28d9; --datepicker-primary-contrast: #ffffff;
      --datepicker-range-background: #f5f3ff; --datepicker-background: #ffffff;
      --datepicker-text-color: #222428; --datepicker-subtle-text-color: #9ca3af;
      --datepicker-border-color: #e9e9e9; --datepicker-hover-background: #f0f0f0;
      display: inline-block;
    }
    :host(.dark-theme) {
      --datepicker-range-background: rgba(139, 92, 246, 0.2); --datepicker-background: #1f2937;
      --datepicker-text-color: #d1d5db; --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #4b5563; --datepicker-hover-background: #374151;
    }

    .ngxsmk-datepicker-container { display: flex; flex-direction: column; width: 100%; }
    .ngxsmk-calendar-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 10px; padding: 12px; background: var(--datepicker-background);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .ngxsmk-ranges-container {
      width: 100%;
      padding: 12px;
      border-right: none;
      border-bottom: 1px solid var(--datepicker-border-color);
      background: var(--datepicker-hover-background);
      border-radius: 10px 10px 0 0;
    }
    .ngxsmk-ranges-container ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      list-style: none; padding: 0; margin: 0;
    }
    .ngxsmk-ranges-container li {
      padding: 6px 10px;
      margin-bottom: 0;
      font-size: 0.85rem;
      border: 1px solid var(--datepicker-border-color);
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      flex-shrink: 0;
    }
    .ngxsmk-ranges-container li:hover { background-color: var(--datepicker-hover-background); }
    .ngxsmk-ranges-container li.disabled { cursor: not-allowed; opacity: 0.5; background-color: transparent !important; color: var(--datepicker-subtle-text-color, #9ca3af); }


    .ngxsmk-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px; position: relative; z-index: 2; gap: 4px;
    }
    .ngxsmk-month-year-selects { display: flex; gap: 4px; }
    .ngxsmk-month-year-selects app-custom-select.month-select { --custom-select-width: 100px; }
    .ngxsmk-month-year-selects app-custom-select.year-select { --custom-select-width: 75px; }
    .ngxsmk-nav-buttons { display: flex; }
    .ngxsmk-nav-button {
      padding: 6px;
      background: none; border: none; cursor: pointer; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center; color: var(--datepicker-text-color);
    }
    .ngxsmk-nav-button:hover:not(:disabled) { background-color: var(--datepicker-hover-background); }
    .ngxsmk-nav-button:disabled { cursor: not-allowed; opacity: 0.5; }
    .ngxsmk-nav-button svg { width: 16px; height: 16px; }

    .ngxsmk-days-grid {
      display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 0;
    }
    .ngxsmk-day-name {
      font-size: 0.75rem;
      padding: 6px 0;
      color: var(--datepicker-subtle-text-color);
      font-weight: 600;
    }
    .ngxsmk-day-cell {
      height: 32px;
      position: relative; display: flex; justify-content: center;
      align-items: center; cursor: pointer; border-radius: 0;
    }
    .ngxsmk-day-number {
      width: 30px; height: 30px;
      display: flex; justify-content: center;
      align-items: center; border-radius: 50%; color: var(--datepicker-text-color);
      font-size: 0.9rem;
      position: relative; z-index: 1;
    }

    .ngxsmk-time-selection {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
      margin-top: 12px; padding-top: 8px;
      border-top: 1px solid var(--datepicker-border-color);
    }
    .ngxsmk-time-label { font-size: 0.9rem; color: var(--datepicker-subtle-text-color); margin-right: 4px; }
    .ngxsmk-time-separator { font-weight: 600; color: var(--datepicker-text-color); }
    .ngxsmk-time-selection app-custom-select { --custom-select-width: 55px; height: 28px; }
    .ngxsmk-time-selection app-custom-select.ampm-select { --custom-select-width: 65px; }

    .ngxsmk-day-cell:not(.disabled):hover .ngxsmk-day-number {
      background-color: var(--datepicker-hover-background); color: var(--datepicker-primary-color);
    }
    .ngxsmk-day-cell.start-date .ngxsmk-day-number,
    .ngxsmk-day-cell.end-date .ngxsmk-day-number,
    .ngxsmk-day-cell.selected .ngxsmk-day-number {
      background-color: var(--datepicker-primary-color); color: var(--datepicker-primary-contrast);
    }
    .ngxsmk-day-cell.in-range, .ngxsmk-day-cell.start-date,
    .ngxsmk-day-cell.end-date, .ngxsmk-day-cell.preview-range {
      background-color: var(--datepicker-range-background);
    }
    .ngxsmk-day-cell.start-date { border-top-left-radius: 100%; border-bottom-left-radius: 100%; }
    .ngxsmk-day-cell.end-date { border-top-right-radius: 100%; border-bottom-right-radius: 100%; }
    .ngxsmk-day-cell.start-date.end-date { border-radius: 50px; }
    .ngxsmk-day-cell.disabled {
      background-color: transparent !important; color: #4b5563;
      cursor: not-allowed; pointer-events: none; opacity: 0.5;
    }
    .ngxsmk-day-cell.today .ngxsmk-day-number { border: 1px solid var(--datepicker-primary-color); }

    @media (min-width: 600px) {
      .ngxsmk-datepicker-container { display: flex; flex-direction: row; }
      .ngxsmk-calendar-container {
        padding: 16px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: auto;
        border-radius: 0 10px 10px 0;
      }
      .ngxsmk-ranges-container {
        width: 180px;
        padding: 16px;
        border-right: 1px solid var(--datepicker-border-color);
        border-bottom: none;
        background: var(--datepicker-background);
        border-radius: 10px 0 0 10px;
      }
      .ngxsmk-ranges-container ul {
        flex-direction: column;
        justify-content: flex-start;
        gap: 0;
      }
      .ngxsmk-ranges-container li {
        padding: 10px;
        margin-bottom: 8px;
        border: none;
        font-size: 1rem;
      }

      .ngxsmk-header { margin-bottom: 12px; gap: 5px; }
      .ngxsmk-month-year-selects app-custom-select.month-select { --custom-select-width: 120px; }
      .ngxsmk-month-year-selects app-custom-select.year-select { --custom-select-width: 90px; }
      .ngxsmk-nav-button { padding: 8px; }
      .ngxsmk-nav-button svg { width: 18px; height: 18px; }
      .ngxsmk-day-name { font-size: 0.8rem; padding: 8px 0; }
      .ngxsmk-day-cell { height: 38px; }
      .ngxsmk-day-number { width: 36px; height: 36px; font-size: 1rem; }
      .ngxsmk-time-selection { margin-top: 16px; padding-top: 12px; }
      .ngxsmk-time-selection app-custom-select { --custom-select-width: 60px; height: 30px; }
      .ngxsmk-time-selection app-custom-select.ampm-select { --custom-select-width: 70px; }
    }
  `],
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() mode: 'single' | 'range' = 'single';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() minuteInterval: number = 1;
  public _internalValue: DatepickerValue = null;

  private _startAtDate: Date | null = null;
  @Input() set startAt(value: DateInput | null) { this._startAtDate = this._normalizeDate(value); }

  private _locale: string = 'en-US';
  @Input() set locale(value: string) { this._locale = value; }
  get locale(): string { return this._locale; }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() { return this.theme === 'dark'; }

  private onChange = (_: any) => {};
  private onTouched = () => {};
  public disabled = false;
  @Input() set disabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  @Output() valueChange = new EventEmitter<DatepickerValue>();

  private _minDate: Date | null = null;
  @Input() set minDate(value: DateInput | null) { this._minDate = this._normalizeDate(value); }

  private _maxDate: Date | null = null;
  @Input() set maxDate(value: DateInput | null) { this._maxDate = this._normalizeDate(value); }

  private _ranges: { [key: string]: [Date, Date] } | null = null;
  @Input() set ranges(value: DateRange | null) {
    if (!value) {
      this._ranges = null;
    } else {
      this._ranges = Object.entries(value).reduce((acc, [key, dates]) => {
        const start = this._normalizeDate(dates[0]);
        const end = this._normalizeDate(dates[1]);
        if (start && end) acc[key] = [start, end];
        return acc;
      }, {} as { [key: string]: [Date, Date] });
    }
    this.updateRangesArray();
  }

  public currentDate: Date = new Date();
  public daysInMonth: (Date | null)[] = [];
  public weekDays: string[] = [];
  public readonly today: Date = getStartOfDay(new Date());
  public selectedDate: Date | null = null;
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public hoveredDate: Date | null = null;
  public rangesArray: { key: string; value: [Date, Date] }[] = [];

  private _currentMonth: number = this.currentDate.getMonth();
  private _currentYear: number = this.currentDate.getFullYear();

  public monthOptions: { label: string; value: number }[] = [];
  public yearOptions: { label: string; value: number }[] = [];
  private firstDayOfWeek: number = 0;

  public currentHour: number = 0;
  public currentMinute: number = 0;
  public currentDisplayHour: number = 12;
  public isPm: boolean = false;

  public hourOptions: { label: string; value: number }[] = [];
  public minuteOptions: { label: string; value: number }[] = [];
  public ampmOptions: { label: string; value: boolean }[] = [
    {label: 'AM', value: false},
    {label: 'PM', value: true}
  ];

  writeValue(val: DatepickerValue): void {
    this._internalValue = val;
    this.initializeValue(val);
    this.generateCalendar();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private emitValue(val: DatepickerValue) {
    this._internalValue = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
  }

  get currentMonth(): number { return this._currentMonth; }

  set currentMonth(month: number) {
    if (this.disabled) return;
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this.currentDate.setMonth(month);
      this.generateCalendar();
    }
  }

  get currentYear(): number { return this._currentYear; }

  set currentYear(year: number) {
    if (this.disabled) return;
    if (this._currentYear !== year) {
      this._currentYear = year;
      this.currentDate.setFullYear(year);
      this.generateCalendar();
    }
  }

  ngOnInit(): void {
    if (this._locale === 'en-US' && typeof navigator !== 'undefined') {
      this._locale = navigator.language;
    }

    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateTimeOptions();

    if (this.showTime && !this._internalValue) {
      const now = new Date();
      this.currentHour = now.getHours();
      this.currentMinute = Math.floor(now.getMinutes() / this.minuteInterval) * this.minuteInterval;

      if (this.currentMinute === 60) {
        this.currentMinute = 0;
        this.currentHour = (this.currentHour + 1) % 24;
      }
      this.update12HourState(this.currentHour);
    }

    if (this._internalValue) {
      this.initializeValue(this._internalValue);
    } else if (this._startAtDate) {
      this.initializeValue(null);
    }
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locale']) {
      this.generateLocaleData();
      this.generateCalendar();
    }

    if (changes['minuteInterval']) {
      this.generateTimeOptions();
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
      this.onTimeChange();
    }

    if (changes['value'] && changes['value'].currentValue !== changes['value'].previousValue) {
      this.writeValue(changes['value'].currentValue);
    }

    if (changes['startAt']) {
      if (!this._internalValue && this._startAtDate) {
        this.currentDate = new Date(this._startAtDate);
        this._currentMonth = this.currentDate.getMonth();
        this._currentYear = this.currentDate.getFullYear();
        this.generateCalendar();
      }
    }
  }

  private get24Hour(displayHour: number, isPm: boolean): number {
    if (isPm) { return displayHour === 12 ? 12 : displayHour + 12; }
    return displayHour === 12 ? 0 : displayHour;
  }

  private update12HourState(fullHour: number): void {
    this.isPm = fullHour >= 12;
    this.currentDisplayHour = fullHour % 12 || 12;
  }

  private applyCurrentTime(date: Date): Date {
    this.currentHour = this.get24Hour(this.currentDisplayHour, this.isPm);
    date.setHours(this.currentHour, this.currentMinute, 0, 0);
    return date;
  }

  private initializeValue(value: DatepickerValue): void {
    let initialDate: Date | null = null;

    if (value) {
      if (this.mode === 'single' && value instanceof Date) {
        this.selectedDate = this._normalizeDate(value);
        initialDate = this.selectedDate;
      } else if (this.mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
        this.startDate = this._normalizeDate(value.start);
        this.endDate = this._normalizeDate(value.end);
        initialDate = this.startDate;
      }
    } else {
      this.selectedDate = null;
      this.startDate = null;
      this.endDate = null;
    }

    const viewCenterDate = initialDate || this._startAtDate || new Date();

    if (viewCenterDate) {
      this.currentDate = new Date(viewCenterDate);
      this._currentMonth = viewCenterDate.getMonth();
      this._currentYear = viewCenterDate.getFullYear();
      this.currentHour = viewCenterDate.getHours();
      this.currentMinute = viewCenterDate.getMinutes();
      this.update12HourState(this.currentHour);
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
    }
  }

  private _normalizeDate(date: DateInput | null): Date | null {
    if (!date) return null;
    const d = (date instanceof Date) ? new Date(date.getTime()) : new Date((date as any).toDate ? (date as any).toDate() : date as any);
    if (isNaN(d.getTime())) return null;
    return d;
  }

  private generateTimeOptions(): void {
    this.hourOptions = Array.from({length: 12}).map((_, i) => ({
      label: (i + 1).toString().padStart(2, '0'),
      value: i + 1,
    }));

    this.minuteOptions = [];
    for (let i = 0; i < 60; i += this.minuteInterval) {
      this.minuteOptions.push({
        label: i.toString().padStart(2, '0'),
        value: i,
      });
    }
  }

  private generateLocaleData(): void {
    const year = new Date().getFullYear();
    this.monthOptions = Array.from({length: 12}).map((_, i) => ({
      label: new Date(year, i, 1).toLocaleDateString(this.locale, {month: 'long'}),
      value: i,
    }));

    try {
      this.firstDayOfWeek = ((new Intl.Locale(this.locale) as any).weekInfo?.firstDay || 0) % 7;
    } catch (e) {
      this.firstDayOfWeek = 0;
    }

    const day = new Date(year, 0, 7 + this.firstDayOfWeek);
    this.weekDays = Array.from({length: 7}).map(() => {
      const weekDay = new Date(day).toLocaleDateString(this.locale, {weekday: 'short'});
      day.setDate(day.getDate() + 1);
      return weekDay;
    });
  }

  private updateRangesArray(): void {
    this.rangesArray = this._ranges ? Object.entries(this._ranges).map(([key, value]) => ({key, value})) : [];
  }

  public selectRange(range: [Date, Date]): void {
    if (this.disabled) return;
    this.startDate = this.applyCurrentTime(range[0]);
    this.endDate = this.applyCurrentTime(range[1]);

    if (this.startDate && this.endDate) {
      this.emitValue({start: this.startDate as Date, end: this.endDate as Date});
    }

    this.currentDate = new Date(this.startDate);
    this.initializeValue({start: this.startDate, end: this.endDate});
    this.generateCalendar();
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;

    const dateOnly = getStartOfDay(date);

    if (this._minDate) {
      const minDateOnly = getStartOfDay(this._minDate);
      if (dateOnly.getTime() < minDateOnly.getTime()) return true;
    }
    if (this._maxDate) {
      const maxDateOnly = getStartOfDay(this._maxDate);
      if (dateOnly.getTime() > maxDateOnly.getTime()) return true;
    }
    return this.isInvalidDate(date);
  }

  public onTimeChange(): void {
    if (this.disabled) return;
    if (this.mode === 'single' && this.selectedDate) {
      this.selectedDate = this.applyCurrentTime(this.selectedDate);
      this.emitValue(this.selectedDate);
    } else if (this.mode === 'range' && this.startDate && this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
      this.endDate = this.applyCurrentTime(this.endDate);
      this.emitValue({start: this.startDate as Date, end: this.endDate as Date});
    } else if (this.mode === 'range' && this.startDate && !this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
    }
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.isDateDisabled(day) || this.disabled) return;

    if (this.mode === 'single') {
      this.selectedDate = this.applyCurrentTime(day);
      this.emitValue(this.selectedDate);
    } else {
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = this.applyCurrentTime(day);
        this.endDate = null;
      } else if (day >= this.startDate) {
        this.endDate = this.applyCurrentTime(day);
        this.emitValue({start: this.startDate as Date, end: this.endDate as Date});
      } else {
        this.startDate = this.applyCurrentTime(day);
        this.endDate = null;
      }
      this.hoveredDate = null;
    }

    const dateToSync = this.mode === 'single' ? this.selectedDate : this.startDate;
    if (dateToSync) {
      this.update12HourState(dateToSync.getHours());
      this.currentMinute = dateToSync.getMinutes();
    }
  }

  public onDateHover(day: Date | null): void {
    if (this.mode === 'range' && this.startDate && !this.endDate && day) {
      this.hoveredDate = day;
    }
  }

  public isPreviewInRange(day: Date | null): boolean {
    if (this.mode !== 'range' || !this.startDate || this.endDate || !this.hoveredDate || !day) return false;
    const start = getStartOfDay(this.startDate).getTime();
    const end = getStartOfDay(this.hoveredDate).getTime();
    const time = getStartOfDay(day).getTime();
    return time > Math.min(start, end) && time < Math.max(start, end);
  }

  public generateCalendar(): void {
    this.daysInMonth = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this._currentMonth = month;
    this._currentYear = year;
    this.generateDropdownOptions();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const emptyCellCount = (startDayOfWeek - this.firstDayOfWeek + 7) % 7;

    for (let i = 0; i < emptyCellCount; i++) {
      this.daysInMonth.push(null);
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.daysInMonth.push(this._normalizeDate(new Date(year, month, i)));
    }
  }

  private generateDropdownOptions(): void {
    const startYear = this._currentYear - 10;
    const endYear = this._currentYear + 10;
    this.yearOptions = [];
    for (let i = startYear; i <= endYear; i++) {
      this.yearOptions.push({label: `${i}`, value: i});
    }
  }

  public changeMonth(delta: number): void {
    if (this.disabled) return;
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.generateCalendar();
  }

  public isSameDay(d1: Date | null, d2: Date | null): boolean {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  public isInRange(d: Date | null): boolean {
    if (!d || !this.startDate || !this.endDate) return false;

    const dTime = getStartOfDay(d).getTime();
    const startDayTime = getStartOfDay(this.startDate).getTime();
    const endDayTime = getStartOfDay(this.endDate).getTime();

    const startTime = Math.min(startDayTime, endDayTime);
    const endTime = Math.max(startDayTime, endDayTime);

    return dTime > startTime && dTime < endTime;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent, DatePipe, ReactiveFormsModule, JsonPipe],
  template: `
    <header class="app-header">
      <h1>ngxsmk-datepicker Demo (CVA/Reactive Forms)</h1>
      <button class="theme-toggle" (click)="toggleTheme()">
        Toggle Theme (Current: {{ currentTheme }})
      </button>
    </header>

    <main class="content" [formGroup]="datepickerForm">
      <section class="example-container">
        <h2>Date Range Picker (Reactive Forms) 🗓️</h2>
        <p>
          Uses <code>formControlName="dateRange"</code> with preset ranges and <code>showTime</code>.
          The calendar is centered on the initial value's start date.
        </p>

        <ngxsmk-datepicker
          mode="range"
          [ranges]="myRanges"
          [showTime]="true"
          [minuteInterval]="15"
          [isInvalidDate]="isWeekend"
          [theme]="currentTheme"
          formControlName="dateRange">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong> <pre>{{ datepickerForm.controls.dateRange.value | json }}</pre>
          <strong>Form Status:</strong> {{ datepickerForm.controls.dateRange.status }}
        </div>
      </section>

      <section class="example-container">
        <h2>Single Date Selection with Time (Reactive Forms) ⏳</h2>
        <p>
          Uses <code>formControlName="singleDateWithTime"</code> with a 5-minute interval.
          The control's value is a single <code>Date</code> object, including the time.
        </p>

        <ngxsmk-datepicker
          mode="single"
          [showTime]="true"
          [minuteInterval]="5"
          [theme]="currentTheme"
          formControlName="singleDateWithTime">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong> <pre>{{ datepickerForm.controls.singleDateWithTime.value | json }}</pre>
          <strong>Form Status:</strong> {{ datepickerForm.controls.singleDateWithTime.status }}
        </div>
      </section>

      <section class="example-container">
        <h2>Localization & Disabled State 🌐🚫</h2>
        <p>
          The picker is initially disabled via the form control (<code>disabledRange</code>). The locale changes dynamically.
        </p>

        <div class="locale-buttons">
          <button (click)="setLocale('en-US')" [class.active]="activeLocale === 'en-US'">English (US)</button>
          <button (click)="setLocale('de-DE')" [class.active]="activeLocale === 'de-DE'">German (DE)</button>
          <button (click)="setLocale('fr-FR')" [class.active]="activeLocale === 'fr-FR'">French (FR)</button>
        </div>
        <br />

        <ngxsmk-datepicker
          [locale]="activeLocale"
          [theme]="'dark'"
          formControlName="disabledRange"
        ></ngxsmk-datepicker>
        <br>
        <button class="toggle-button" (click)="toggleDisabled()">Toggle Disabled State</button>

        <div class="result-box">
          <strong>Form Value:</strong> <pre>{{ datepickerForm.controls.disabledRange.value | json }}</pre>
          <strong>Form Status:</strong> {{ datepickerForm.controls.disabledRange.status }}
        </div>
      </section>

      <section class="example-container">
        <h2>Single Date Selection with Min/Max Dates 📅</h2>
        <p>
          Selection is limited between {{minDate | date:'MM/dd/yyyy'}} and {{maxDate | date:'MM/dd/yyyy' }}.
          Uses <code>formControlName="singleDateMinMax"</code>.
        </p>

        <ngxsmk-datepicker
          mode="single"
          [minDate]="minDate"
          [maxDate]="maxDate"
          [theme]="currentTheme"
          formControlName="singleDateMinMax"
        >
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong> <pre>{{ datepickerForm.controls.singleDateMinMax.value | json }}</pre>
          <strong>Form Status:</strong> {{ datepickerForm.controls.singleDateMinMax.status }}
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      --datepicker-primary-color: #6d28d9; --datepicker-primary-contrast: #ffffff;
      --datepicker-range-background: #f5f3ff; --datepicker-background: #ffffff;
      --datepicker-text-color: #222428; --datepicker-subtle-text-color: #9ca3af;
      --datepicker-border-color: #e9e9e9; --datepicker-hover-background: #f0f0f0;
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f5f8;
      min-height: 100vh;
      overflow-x: hidden;
    }

    :host(.dark-theme) {
      --datepicker-range-background: rgba(139, 92, 246, 0.2); --datepicker-background: #1f2937;
      --datepicker-text-color: #d1d5db; --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #4b5563; --datepicker-hover-background: #374151;
      background-color: #111827;
    }

    .app-header {
      background-color: #24292e;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-header h1 { margin: 0; font-size: 1.5rem; font-weight: 600; }

    .theme-toggle, .toggle-button {
      background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 8px;
      cursor: pointer; font-size: 0.9rem; transition: background-color 0.2s;
    }
    .toggle-button { background-color: #10b981; }
    .theme-toggle:hover { background-color: #2563eb; }
    .toggle-button:hover { background-color: #059669; }

    @media (max-width: 600px) {
      .app-header { padding: 1rem 1rem; flex-direction: column; gap: 8px; }
      .app-header h1 { font-size: 1.25rem; }
    }

    .content { padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    @media (max-width: 600px) { .content { padding: 1rem; gap: 1.5rem; } }

    .example-container {
      width: 100%; max-width: 620px; padding: 1.5rem; background: var(--datepicker-background, #ffffff);
      border-radius: 12px; box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
      display: flex; flex-direction: column; align-items: center;
    }
    :host(.dark-theme) .example-container { background: #1f2937; color: #e5e7eb; }

    .example-container h2 { font-weight: 600; margin-top: 0; color: var(--datepicker-text-color, #333); }
    .example-container p {
      color: var(--datepicker-subtle-text-color, #666); font-size: 1rem; margin-bottom: 24px;
      border-left: 4px solid var(--datepicker-border-color, #e1e4e8); padding-left: 12px;
      line-height: 1.5; width: 100%;
    }

    .result-box {
      margin-top: 24px; padding: 1rem; background-color: var(--datepicker-hover-background, #f6f8fa);
      border: 1px solid var(--datepicker-border-color, #d1d5da); border-radius: 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 0.95rem; word-wrap: break-word; color: var(--datepicker-text-color, #24292e); width: 100%;
    }
    .result-box strong { font-weight: 600; }

    .locale-buttons { display: flex; flex-direction: row; align-items: center; gap: 1rem; }
    .locale-buttons button {
      background-color: #04aa6d; border: none; color: white; padding: 10px; text-align: center;
      text-decoration: none; font-size: 14px; border-radius: 12px; cursor: pointer;
      min-height: 44px; min-width: 44px; transition: background-color 0.2s;
    }
    .locale-buttons button.active { background-color: #037f52; box-shadow: 0 0 0 3px rgba(4, 170, 109, 0.4); }
  `],
})
export class App {
  private today = new Date();
  private fourMonthsFromNow = addMonths(this.today, 4);

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public activeLocale: string = 'en-US';
  public currentTheme: 'light' | 'dark' = 'light';

  public initialRangeValue: { start: Date; end: Date } = {
    start: getStartOfDay(this.fourMonthsFromNow),
    end: getEndOfDay(this.fourMonthsFromNow),
  };
  public initialSingleDateTimeValue: Date = new Date();

  constructor() {
    this.initialSingleDateTimeValue.setFullYear(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + 2);
    this.initialSingleDateTimeValue.setHours(14, 30, 0, 0);
  }

  public datepickerForm = new FormGroup({
    dateRange: new FormControl(this.initialRangeValue),
    singleDateWithTime: new FormControl(this.initialSingleDateTimeValue),
    singleDateMinMax: new FormControl<Date | null>(null),
    disabledRange: new FormControl({ value: this.initialRangeValue, disabled: true }),
  });

  public myRanges: DateRange = {
    'Today': [getStartOfDay(this.today), getEndOfDay(this.today)],
    'Yesterday': [getStartOfDay(subtractDays(this.today, 1)), getEndOfDay(subtractDays(this.today, 1))],
    'Last 7 Days': [getStartOfDay(subtractDays(this.today, 6)), getEndOfDay(this.today)],
    'This Month': [getStartOfMonth(this.today), getEndOfMonth(this.today)],
  };

  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  setLocale(locale: string): void {
    this.activeLocale = locale;
  }

  toggleDisabled(): void {
    const control = this.datepickerForm.controls.disabledRange;
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }
}
