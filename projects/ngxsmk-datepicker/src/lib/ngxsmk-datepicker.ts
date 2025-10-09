import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {FormsModule} from '@angular/forms';

// #####################################################################
// ## Reusable Custom Select Component
// #####################################################################
@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-select-container" (click)="toggleDropdown()">
      <button type="button" class="select-display">
        <span>{{ displayValue }}</span>
        <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                d="M112 184l144 144 144-144"/>
        </svg>
      </button>
      @if (isOpen) {
        <div class="options-panel">
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
    :host {
      position: relative;
      display: inline-block;
    }

    .custom-select-container {
      cursor: pointer;
    }

    .select-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: var(--custom-select-width, 115px);
      background: var(--datepicker-background, #fff);
      border: 1px solid var(--datepicker-border-color, #ccc);
      color: var(--datepicker-text-color, #333);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 1rem;
      text-align: left;
    }

    .arrow-icon {
      width: 12px;
      height: 12px;
      margin-left: 8px;
    }

    .options-panel {
      position: absolute;
      top: 110%;
      left: 0;
      width: 100%;
      background: var(--datepicker-background, #fff);
      border: 1px solid var(--datepicker-border-color, #ccc);
      color: var(--datepicker-text-color, #333);
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
    }

    .options-panel ul {
      list-style: none;
      padding: 4px;
      margin: 0;
    }

    .options-panel li {
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    .options-panel li:hover {
      background-color: var(--datepicker-hover-background, #f0f0f0);
    }

    .options-panel li.selected {
      background-color: var(--datepicker-primary-color, #3880ff);
      color: var(--datepicker-primary-contrast, #fff);
    }
  `],
})
export class CustomSelectComponent {
  @Input() options: { label: string; value: any }[] = [];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  public isOpen = false;

  constructor(private readonly elementRef: ElementRef) {
  }

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

// #####################################################################
// ## Datepicker Component
// #####################################################################
export type DateInput = Date | string | { toDate: () => Date; _isAMomentObject?: boolean; $d?: Date };

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent],
  template: `
    <div class="datepicker-container">
      @if (showRanges && rangesArray.length > 0 && mode === 'range') {
        <div class="ranges-container">
          <ul>
            @for (range of rangesArray; track range.key) {
              <li (click)="selectRange(range.value)">{{ range.key }}</li>
            }
          </ul>
        </div>
      }
      <div class="calendar-container">
        <div class="header">
          <div class="month-year-selects">
            <app-custom-select class="month-select" [options]="monthOptions"
                               [(value)]="currentMonth"></app-custom-select>
            <app-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear"></app-custom-select>
          </div>
          <div class="nav-buttons">
            <button type="button" class="nav-button" (click)="changeMonth(-1)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                      d="M328 112L184 256l144 144"/>
              </svg>
            </button>
            <button type="button" class="nav-button" (click)="changeMonth(1)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                      d="M184 112l144 144-144 144"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="days-grid-wrapper">
          <div class="days-grid">
            @for (day of weekDays; track day) {
              <div class="day-name">{{ day }}</div>
            }
            @for (day of daysInMonth; track $index) {
              <div class="day-cell"
                   [class.empty]="!day" [class.disabled]="isDateDisabled(day)" [class.today]="isSameDay(day, today)"
                   [class.selected]="mode === 'single' && isSameDay(day, selectedDate)"
                   [class.start-date]="mode === 'range' && isSameDay(day, startDate)"
                   [class.end-date]="mode === 'range' && isSameDay(day, endDate)"
                   [class.in-range]="mode === 'range' && isInRange(day)"
                   [class.preview-range]="isPreviewInRange(day)"
                   (click)="onDateClick(day)" (mouseenter)="onDateHover(day)">
                @if (day) {
                  <div class="day-number">{{ day | date : 'd' }}</div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --datepicker-primary-color: #6d28d9;
      --datepicker-primary-contrast: #ffffff;
      --datepicker-range-background: #f5f3ff;
      --datepicker-background: #ffffff;
      --datepicker-text-color: #222428;
      --datepicker-subtle-text-color: #9ca3af;
      --datepicker-border-color: #e9e9e9;
      --datepicker-hover-background: #f0f0f0;
    }

    :host(.dark-theme) {
      --datepicker-range-background: rgba(139, 92, 246, 0.2);
      --datepicker-background: #1f2937;
      --datepicker-text-color: #d1d5db;
      --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #4b5563;
      --datepicker-hover-background: #374151;
    }

    .datepicker-container {
      display: flex;
    }

    .calendar-container {
      width: 320px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid var(--datepicker-border-color);
      border-radius: 10px;
      padding: 16px;
      background: var(--datepicker-background);
      overflow: hidden;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      position: relative;
      z-index: 2;
    }

    .month-year-selects {
      display: flex;
      gap: 8px;
    }

    .month-year-selects app-custom-select.month-select {
      --custom-select-width: 120px;
    }

    .month-year-selects app-custom-select.year-select {
      --custom-select-width: 90px;
    }

    .nav-buttons {
      display: flex;
    }

    .nav-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--datepicker-text-color);
    }

    .nav-button:hover {
      background-color: var(--datepicker-hover-background);
    }

    .nav-button svg {
      width: 18px;
      height: 18px;
    }

    .days-grid-wrapper {
      position: relative;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      gap: 0;
    }

    .day-name {
      font-weight: 600;
      font-size: 0.8rem;
      color: var(--datepicker-subtle-text-color);
      padding: 8px 0;
    }

    .day-cell {
      position: relative;
      height: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 0;
    }

    .day-number {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      color: var(--datepicker-text-color);
      position: relative;
      z-index: 1;
    }

    .day-cell:not(.disabled):hover .day-number {
      background-color: var(--datepicker-hover-background);
    }

    .day-cell.start-date .day-number,
    .day-cell.end-date .day-number,
    .day-cell.selected .day-number {
      background-color: var(--datepicker-primary-color);
      color: var(--datepicker-primary-contrast);
    }

    .day-cell.in-range, .day-cell.start-date, .day-cell.end-date, .day-cell.preview-range {
      background-color: var(--datepicker-range-background);
    }

    .day-cell.start-date {
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
    }

    .day-cell.end-date {
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
    }

    .day-cell.start-date.end-date {
      border-radius: 50px;
    }

    .day-cell.disabled {
      background-color: transparent !important;
      color: #4b5563;
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    .day-cell.today .day-number {
      border: 1px solid var(--datepicker-primary-color);
    }

    .ranges-container {
      width: 180px;
      padding: 16px;
      border-right: 1px solid var(--datepicker-border-color);
      background: var(--datepicker-background);
    }

    .ranges-container ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ranges-container li {
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--datepicker-text-color);
    }

    .ranges-container li:hover {
      background-color: var(--datepicker-hover-background);
    }
  `],
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges {
  @Input() mode: 'single' | 'range' = 'single';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;

  // FIX: Use a private variable for locale with a fallback value.
  private _locale: string = 'en-US';

  @Input() set locale(value: string) {
    this._locale = value;
  }

  get locale(): string {
    return this._locale;
  }

  @Input() theme: 'light' | 'dark' = 'light';

  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.theme === 'dark';
  }

  @Output() valueChange = new EventEmitter<Date | { start: Date; end: Date }>();

  private _minDate: Date | null = null;

  @Input() set minDate(value: DateInput | null) {
    this._minDate = this._normalizeDate(value);
  }

  private _maxDate: Date | null = null;

  @Input() set maxDate(value: DateInput | null) {
    this._maxDate = this._normalizeDate(value);
  }

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
  private _currentMonth!: number;
  private _currentYear!: number;
  public monthOptions: { label: string; value: number }[] = [];
  public yearOptions: { label: string; value: number }[] = [];
  private firstDayOfWeek: number = 0;

  // FIX: Inject PLATFORM_ID and conditionally access navigator
  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this._locale = navigator.language;
    }
  }

  get currentMonth(): number {
    return this._currentMonth;
  }

  set currentMonth(month: number) {
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this.currentDate.setMonth(month);
      this.generateCalendar();
    }
  }

  get currentYear(): number {
    return this._currentYear;
  }

  set currentYear(year: number) {
    if (this._currentYear !== year) {
      this._currentYear = year;
      this.currentDate.setFullYear(year);
      this.generateCalendar();
    }
  }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locale']) {
      this.generateLocaleData();
      this.generateCalendar();
    }
  }

  private _normalizeDate(date: DateInput | null): Date | null {
    if (!date) return null;
    const d = (date instanceof Date) ? new Date(date.getTime()) : new Date(date as any);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private generateLocaleData(): void {
    this.monthOptions = Array.from({length: 12}).map((_, i) => ({
      label: new Date(2024, i, 1).toLocaleDateString(this.locale, {month: 'long'}),
      value: i,
    }));
    try {
      // Use this.locale getter
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
    this.startDate = range[0];
    this.endDate = range[1];
    this.valueChange.emit({start: this.startDate, end: this.endDate});
    this.currentDate = new Date(this.startDate);
    this.generateCalendar();
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;
    if (this._minDate && date < this._minDate) return true;
    if (this._maxDate && date > this._maxDate) return true;
    if (this.isInvalidDate(date)) return true;
    return false;
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.isDateDisabled(day)) return;
    if (this.mode === 'single') {
      this.selectedDate = day;
      this.valueChange.emit(this.selectedDate);
    } else {
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = day;
        this.endDate = null;
      } else if (day >= this.startDate) {
        this.endDate = day;
        this.valueChange.emit({start: this.startDate, end: this.endDate});
      } else {
        this.startDate = day;
        this.endDate = null;
      }
      this.hoveredDate = null;
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
    return (
      d.getTime() > this.startDate.getTime() &&
      d.getTime() < this.endDate.getTime()
    );
  }
}
