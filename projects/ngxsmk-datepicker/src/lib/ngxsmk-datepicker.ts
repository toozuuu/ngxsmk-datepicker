import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ngxsmk-select-container" (click)="toggleDropdown()">
      <button type="button" class="ngxsmk-select-display">
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
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { label: string; value: any }): void {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.isOpen = false;
  }
}

export type DateInput = Date | string | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent],
  template: `
    <div class="ngxsmk-datepicker-container">
      @if (showRanges && rangesArray.length > 0 && mode === 'range') {
        <div class="ngxsmk-ranges-container">
          <ul>
            @for (range of rangesArray; track range.key) {
              <li (click)="selectRange(range.value)">{{ range.key }}</li>
            }
          </ul>
        </div>
      }
      <div class="ngxsmk-calendar-container">
        <div class="ngxsmk-header">
          <div class="ngxsmk-month-year-selects">
            <app-custom-select class="month-select" [options]="monthOptions"
                               [(value)]="currentMonth"></app-custom-select>
            <app-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear"></app-custom-select>
          </div>
          <div class="ngxsmk-nav-buttons">
            <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(-1)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                      d="M328 112L184 256l144 144"/>
              </svg>
            </button>
            <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(1)">
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
            ></app-custom-select>
            <span class="ngxsmk-time-separator">:</span>
            <app-custom-select
              class="minute-select"
              [options]="minuteOptions"
              [(value)]="currentMinute"
              (valueChange)="onTimeChange()"
            ></app-custom-select>
            <app-custom-select
              class="ampm-select"
              [options]="ampmOptions"
              [(value)]="isPm"
              (valueChange)="onTimeChange()"
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
    }
    :host(.dark-theme) {
      --datepicker-range-background: rgba(139, 92, 246, 0.2); --datepicker-background: #1f2937;
      --datepicker-text-color: #d1d5db; --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #4b5563; --datepicker-hover-background: #374151;
    }
    .ngxsmk-datepicker-container { display: flex; }
    .ngxsmk-calendar-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border-radius: 10px; padding: 16px; background: var(--datepicker-background);
    }
    .ngxsmk-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px; position: relative; z-index: 2; gap: 5px;
    }
    .ngxsmk-month-year-selects { display: flex; gap: 5px; }
    .ngxsmk-month-year-selects app-custom-select.month-select { --custom-select-width: 120px; }
    .ngxsmk-month-year-selects app-custom-select.year-select { --custom-select-width: 90px; }
    .ngxsmk-nav-buttons { display: flex; }
    .ngxsmk-nav-button {
      background: none; border: none; padding: 8px; cursor: pointer; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center; color: var(--datepicker-text-color);
    }
    .ngxsmk-nav-button:hover { background-color: var(--datepicker-hover-background); }
    .ngxsmk-nav-button svg { width: 18px; height: 18px; }
    .ngxsmk-days-grid-wrapper { position: relative; }
    .ngxsmk-days-grid {
      display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; gap: 0;
    }
    .ngxsmk-day-name {
      font-weight: 600; font-size: 0.8rem; color: var(--datepicker-subtle-text-color); padding: 8px 0;
    }
    .ngxsmk-day-cell {
      position: relative; height: 38px; display: flex; justify-content: center;
      align-items: center; cursor: pointer; border-radius: 0;
    }
    .ngxsmk-day-number {
      width: 36px; height: 36px; display: flex; justify-content: center;
      align-items: center; border-radius: 50%; color: var(--datepicker-text-color);
      position: relative; z-index: 1;
    }
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
    .ngxsmk-ranges-container {
      width: 180px; padding: 16px; border-right: 1px solid var(--datepicker-border-color);
      background: var(--datepicker-background);
    }
    .ngxsmk-ranges-container ul { list-style: none; padding: 0; margin: 0; }
    .ngxsmk-ranges-container li {
      padding: 10px; margin-bottom: 8px; border-radius: 6px; cursor: pointer; color: var(--datepicker-text-color);
    }
    .ngxsmk-ranges-container li:hover { background-color: var(--datepicker-hover-background); }
    .ngxsmk-time-selection {
      display: flex; align-items: center; justify-content: center; gap: 4px;
      margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--datepicker-border-color);
    }
    .ngxsmk-time-label { font-size: 0.9rem; color: var(--datepicker-subtle-text-color); margin-right: 4px; }
    .ngxsmk-time-selection app-custom-select { --custom-select-width: 60px; height: 30px; }
    .ngxsmk-time-selection app-custom-select.ampm-select { --custom-select-width: 70px; }
    .ngxsmk-time-separator { font-weight: 600; font-size: 1.1rem; color: var(--datepicker-text-color); }
  `],
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges {
  @Input() mode: 'single' | 'range' = 'single';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() minuteInterval: number = 1;
  @Input() value: Date | { start: Date, end: Date } | null = null;

  private _locale: string = 'en-US';
  @Input() set locale(value: string) { this._locale = value; }
  get locale(): string { return this._locale; }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() { return this.theme === 'dark'; }
  @Output() valueChange = new EventEmitter<Date | { start: Date; end: Date }>();

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
  public readonly today: Date = new Date();
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

  get currentMonth(): number { return this._currentMonth; }

  set currentMonth(month: number) {
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this.currentDate.setMonth(month);
      this.generateCalendar();
    }
  }

  get currentYear(): number { return this._currentYear; }

  set currentYear(year: number) {
    if (this._currentYear !== year) {
      this._currentYear = year;
      this.currentDate.setFullYear(year);
      this.generateCalendar();
    }
  }

  ngOnInit(): void {
    if (this._locale === 'en-US') {
      this._locale = navigator.language;
    }

    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateTimeOptions();

    if (this.showTime && !this.value) {
      const now = new Date();
      this.currentHour = now.getHours();
      this.currentMinute = Math.floor(now.getMinutes() / this.minuteInterval) * this.minuteInterval;

      if (this.currentMinute === 60) {
        this.currentMinute = 0;
        this.currentHour = (this.currentHour + 1) % 24;
      }
      this.update12HourState(this.currentHour);
    }

    if (this.value) {
      this.initializeValue(this.value);
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
      this.initializeValue(changes['value'].currentValue);
      this.generateCalendar();
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

  private initializeValue(value: Date | { start: Date, end: Date } | null): void {
    if (!value) {
      this.selectedDate = null; this.startDate = null; this.endDate = null;
      return;
    }

    let initialDate: Date | null = null;
    if (this.mode === 'single' && value instanceof Date) {
      this.selectedDate = this._normalizeDate(value); initialDate = this.selectedDate;
    } else if (this.mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.startDate = this._normalizeDate(value.start);
      this.endDate = this._normalizeDate(value.end);
      initialDate = this.startDate;
    }

    if (initialDate) {
      this.currentDate = new Date(initialDate);
      this.currentHour = initialDate.getHours();
      this.currentMinute = initialDate.getMinutes();
      this.update12HourState(this.currentHour);
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
    }
  }

  private _normalizeDate(date: DateInput | null): Date | null {
    if (!date) return null;
    const d = (date instanceof Date) ? new Date(date.getTime()) : new Date(date as any);
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
    this.monthOptions = Array.from({length: 12}).map((_, i) => ({
      label: new Date(2024, i, 1).toLocaleDateString(this.locale, {month: 'long'}),
      value: i,
    }));

    try {
      this.firstDayOfWeek = ((new Intl.Locale(this.locale) as any).weekInfo?.firstDay || 0) % 7;
    } catch (e) {
      this.firstDayOfWeek = 0;
    }

    const day = new Date(2024, 0, 7 + this.firstDayOfWeek);
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
    this.startDate = this.applyCurrentTime(range[0]);
    this.endDate = this.applyCurrentTime(range[1]);

    if (this.startDate && this.endDate) {
      this.valueChange.emit({start: this.startDate as Date, end: this.endDate as Date});
    }

    this.currentDate = new Date(this.startDate);
    this.initializeValue({start: this.startDate, end: this.endDate});
    this.generateCalendar();
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (this._minDate) {
      const minDateOnly = new Date(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate());
      if (dateOnly < minDateOnly) return true;
    }
    if (this._maxDate) {
      const maxDateOnly = new Date(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate());
      if (dateOnly > maxDateOnly) return true;
    }
    return this.isInvalidDate(date);
  }

  public onTimeChange(): void {
    if (this.mode === 'single' && this.selectedDate) {
      this.selectedDate = this.applyCurrentTime(this.selectedDate);
      this.valueChange.emit(this.selectedDate);
    } else if (this.mode === 'range' && this.startDate && this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
      this.endDate = this.applyCurrentTime(this.endDate);
      this.valueChange.emit({start: this.startDate as Date, end: this.endDate as Date});
    } else if (this.mode === 'range' && this.startDate && !this.endDate) {
      this.startDate = this.applyCurrentTime(this.startDate);
    }
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.isDateDisabled(day)) return;

    if (this.mode === 'single') {
      this.selectedDate = this.applyCurrentTime(day);
      this.valueChange.emit(this.selectedDate);
    } else {
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = this.applyCurrentTime(day);
        this.endDate = null;
      } else if (day >= this.startDate) {
        this.endDate = this.applyCurrentTime(day);
        this.valueChange.emit({start: this.startDate as Date, end: this.endDate as Date});
      } else {
        this.startDate = this.applyCurrentTime(day);
        this.endDate = null;
      }
      this.hoveredDate = null;
    }

    if (this.mode === 'single' && this.selectedDate) {
      this.update12HourState(this.selectedDate.getHours());
      this.currentMinute = this.selectedDate.getMinutes();
    } else if (this.mode === 'range' && this.startDate) {
      this.update12HourState(this.startDate.getHours());
      this.currentMinute = this.startDate.getMinutes();
    }
  }

  public onDateHover(day: Date | null): void {
    if (this.mode === 'range' && this.startDate && !this.endDate && day) {
      this.hoveredDate = day;
    }
  }

  public isPreviewInRange(day: Date | null): boolean {
    if (this.mode !== 'range' || !this.startDate || this.endDate || !this.hoveredDate || !day) return false;
    const start = this.startDate.getTime();
    const end = this.hoveredDate.getTime();
    const time = day.getTime();
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

    const dTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const startDayTime = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()).getTime();
    const endDayTime = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate()).getTime();

    const startTime = Math.min(startDayTime, endDayTime);
    const endTime = Math.max(startDayTime, endDayTime);

    return dTime > startTime && dTime < endTime;
  }
}
