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
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  getStartOfDay,
  addMonths,
  normalizeDate,
  DateInput,
} from './utils/date.utils';
import {
  HolidayProvider,
  DateRange,
  DatepickerValue,
  generateMonthOptions,
  generateYearOptions,
  generateTimeOptions,
  generateWeekDays,
  getFirstDayOfWeek,
  get24Hour,
  update12HourState,
  processDateRanges,
} from './utils/calendar.utils';
import { CustomSelectComponent } from './components/custom-select.component';
import { createDateComparator } from './utils/performance.utils';


@Component({
  selector: 'ngxsmk-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent, DatePipe, ReactiveFormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxsmkDatepickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./styles/datepicker.css'],
  template: `
    <div class="ngxsmk-datepicker-wrapper" [class.ngxsmk-inline-mode]="isInlineMode">
      @if (!isInlineMode) {
        <div class="ngxsmk-input-group" (click)="toggleCalendar()" [class.disabled]="disabled">
          <input type="text" 
                 [value]="displayValue" 
                 [placeholder]="placeholder" 
                 readonly 
                 [disabled]="disabled"
                 class="ngxsmk-display-input">
          <button type="button" class="ngxsmk-clear-button" (click)="clearValue($event)" [disabled]="disabled" *ngIf="displayValue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
          </button>
        </div>
      }

      @if (isCalendarVisible) {
        <div class="ngxsmk-popover-container" [class.ngxsmk-inline-container]="isInlineMode">
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
                  <ngxsmk-custom-select class="month-select" [options]="monthOptions"
                                    [(value)]="currentMonth" [disabled]="disabled"></ngxsmk-custom-select>
                  <ngxsmk-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear" [disabled]="disabled"></ngxsmk-custom-select>
                </div>
                <div class="ngxsmk-nav-buttons">
                  <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(-1)" [disabled]="disabled || isBackArrowDisabled">
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
                        [class.empty]="!isCurrentMonth(day)" [class.disabled]="isDateDisabled(day)" 
                        [class.today]="isSameDay(day, today)"
                        [class.holiday]="isHoliday(day)"
                        [class.selected]="mode === 'single' && isSameDay(day, selectedDate)"
                        [class.multiple-selected]="mode === 'multiple' && isMultipleSelected(day)"
                        [class.start-date]="mode === 'range' && isSameDay(day, startDate)"
                        [class.end-date]="mode === 'range' && isSameDay(day, endDate)"
                        [class.in-range]="mode === 'range' && isInRange(day)"
                        [class.preview-range]="isPreviewInRange(day)"
                        (click)="onDateClick(day)" (mouseenter)="onDateHover(day)">
                      @if (day) {
                        <div class="ngxsmk-day-number" [attr.title]="getHolidayLabel(day)">{{ day | date : 'd' }}</div>
                      }
                    </div>
                  }
                </div>
              </div>

              @if (showTime) {
                <div class="ngxsmk-time-selection">
                  <span class="ngxsmk-time-label">Time:</span>
                  <ngxsmk-custom-select
                    class="hour-select"
                    [options]="hourOptions"
                    [(value)]="currentDisplayHour"
                    (valueChange)="onTimeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                  <span class="ngxsmk-time-separator">:</span>
                  <ngxsmk-custom-select
                    class="minute-select"
                    [options]="minuteOptions"
                    [(value)]="currentMinute"
                    (valueChange)="onTimeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                  <ngxsmk-custom-select
                    class="ampm-select"
                    [options]="ampmOptions"
                    [(value)]="isPm"
                    (valueChange)="onTimeChange()"
                    [disabled]="disabled"
                  ></ngxsmk-custom-select>
                </div>
              }
              
              <div class="ngxsmk-footer" *ngIf="!isInlineMode">
                <button type="button" class="ngxsmk-clear-button-footer" (click)="clearValue($event)" [disabled]="disabled">
                  Clear
                </button>
                <button type="button" class="ngxsmk-close-button" (click)="isCalendarOpen = false" [disabled]="disabled">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() mode: 'single' | 'range' | 'multiple' = 'single';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() minuteInterval: number = 1;
  
  // NEW: Holiday Provider Inputs
  @Input() holidayProvider: HolidayProvider | null = null;
  @Input() disableHolidays: boolean = false;
  
  // Popover/Input Mode
  @Input() placeholder: string = 'Select Date';
  @Input() inline: boolean | 'always' | 'auto' = false;
  public isCalendarOpen: boolean = false;

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
  @Output() action = new EventEmitter<{ type: string; payload?: any }>();

  private _minDate: Date | null = null;
  @Input() set minDate(value: DateInput | null) { this._minDate = this._normalizeDate(value); }

  private _maxDate: Date | null = null;
  @Input() set maxDate(value: DateInput | null) { this._maxDate = this._normalizeDate(value); }

  private _ranges: { [key: string]: [Date, Date] } | null = null;
  @Input() set ranges(value: DateRange | null) {
    this._ranges = processDateRanges(value);
    this.updateRangesArray();
  }

  public currentDate: Date = new Date();
  public daysInMonth: (Date | null)[] = [];
  public weekDays: string[] = [];
  public readonly today: Date = getStartOfDay(new Date());
  public selectedDate: Date | null = null;
  public selectedDates: Date[] = [];
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

  // Animation state properties
  
  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly dateComparator = createDateComparator();
  
  get isInlineMode(): boolean {
    return this.inline === true || this.inline === 'always' || 
           (this.inline === 'auto' && typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);
  }

  get isCalendarVisible(): boolean {
    return this.isInlineMode || this.isCalendarOpen;
  }
  
  get displayValue(): string {
    if (this.mode === 'single' && this.selectedDate) {
      return this.selectedDate.toLocaleString(this.locale, { 
        year: 'numeric', month: 'short', day: '2-digit', 
        hour: this.showTime ? '2-digit' : undefined, 
        minute: this.showTime ? '2-digit' : undefined 
      });
    } else if (this.mode === 'range' && this.startDate && this.endDate) {
      const start = this.startDate.toLocaleString(this.locale, { year: 'numeric', month: 'short', day: '2-digit' });
      const end = this.endDate.toLocaleString(this.locale, { year: 'numeric', month: 'short', day: '2-digit' });
      return `${start} - ${end}`;
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return `${this.selectedDates.length} dates selected`;
    }
    return '';
  }

  get isBackArrowDisabled(): boolean {
    if (!this._minDate) return false;
    
    // Get the first day of the current month
    const firstDayOfCurrentMonth = new Date(this.currentYear, this.currentMonth, 1);
    
    // Check if the first day of current month is before or equal to minDate
    return firstDayOfCurrentMonth <= this._minDate;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isInlineMode && this.isCalendarOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isCalendarOpen = false;
    }
  }


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
    
    // Auto-close popover when a selection is complete
    if (!this.isInlineMode && val !== null) {
      if (this.mode === 'single' || (this.mode === 'range' && this.startDate && this.endDate)) {
        this.isCalendarOpen = false;
      }
    }
  }
  
  public toggleCalendar(): void {
    if (this.disabled || this.isInlineMode) return;
    this.isCalendarOpen = !this.isCalendarOpen;
  }
  
  public clearValue(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.disabled) return;
    
    this.selectedDate = null;
    this.selectedDates = [];
    this.startDate = null;
    this.endDate = null;
    this.hoveredDate = null;
    this.isCalendarOpen = false;
    
    this.emitValue(null);
    this.action.emit({type: 'clear', payload: null});
    
    // Reset view to today after clearing
    this.currentDate = new Date();
    this._currentMonth = this.currentDate.getMonth();
    this._currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
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
    
    // Rerun calendar generation if provider changes to refresh disabled states
    if (changes['holidayProvider'] || changes['disableHolidays']) {
        this.generateCalendar();
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
    return get24Hour(displayHour, isPm);
  }

  private update12HourState(fullHour: number): void {
    const state = update12HourState(fullHour);
    this.isPm = state.isPm;
    this.currentDisplayHour = state.displayHour;
  }

  private applyCurrentTime(date: Date): Date {
    this.currentHour = this.get24Hour(this.currentDisplayHour, this.isPm);
    date.setHours(this.currentHour, this.currentMinute, 0, 0);
    return date;
  }

  private initializeValue(value: DatepickerValue): void {
    let initialDate: Date | null = null;

    this.selectedDate = null;
    this.startDate = null;
    this.endDate = null;
    this.selectedDates = [];

    if (value) {
      if (this.mode === 'single' && value instanceof Date) {
        this.selectedDate = this._normalizeDate(value);
        initialDate = this.selectedDate;
      } else if (this.mode === 'range' && typeof value === 'object' && 'start' in value && 'end' in value) {
        this.startDate = this._normalizeDate((value as {start: Date, end: Date}).start);
        this.endDate = this._normalizeDate((value as {start: Date, end: Date}).end);
        initialDate = this.startDate;
      } else if (this.mode === 'multiple' && Array.isArray(value)) {
        this.selectedDates = (value as Date[]).map(d => this._normalizeDate(d)).filter((d): d is Date => d !== null);
        initialDate = this.selectedDates.length > 0 ? this.selectedDates[this.selectedDates.length - 1]! : null;
      }
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
    return normalizeDate(date);
  }

  private generateTimeOptions(): void {
    const { hourOptions, minuteOptions } = generateTimeOptions(this.minuteInterval);
    this.hourOptions = hourOptions;
    this.minuteOptions = minuteOptions;
  }

  private generateLocaleData(): void {
    const year = new Date().getFullYear();
    this.monthOptions = generateMonthOptions(this.locale, year);
    this.firstDayOfWeek = getFirstDayOfWeek(this.locale);
    this.weekDays = generateWeekDays(this.locale, this.firstDayOfWeek);
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
    this.action.emit({type: 'rangeSelected', payload: {start: this.startDate, end: this.endDate, key: this.rangesArray.find(r => r.value === range)?.key}});
  }
  
  // NEW: Check if a date is a holiday
  public isHoliday(date: Date | null): boolean {
    if (!date || !this.holidayProvider) return false;
    const dateOnly = getStartOfDay(date);
    return this.holidayProvider.isHoliday(dateOnly);
  }
  
  // NEW: Get holiday label
  public getHolidayLabel(date: Date | null): string | null {
    if (!date || !this.holidayProvider || !this.isHoliday(date)) return null;
    return this.holidayProvider.getHolidayLabel ? this.holidayProvider.getHolidayLabel(getStartOfDay(date)) : 'Holiday';
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;

    const dateOnly = getStartOfDay(date);

    // 1. Check holiday provider for disabling
    if (this.holidayProvider && this.disableHolidays && this.holidayProvider.isHoliday(dateOnly)) {
      return true;
    }

    // 2. Check min/max date
    if (this._minDate) {
      const minDateOnly = getStartOfDay(this._minDate);
      if (dateOnly.getTime() < minDateOnly.getTime()) return true;
    }
    if (this._maxDate) {
      const maxDateOnly = getStartOfDay(this._maxDate);
      if (dateOnly.getTime() > maxDateOnly.getTime()) return true;
    }
    
    // 3. Check custom invalid date function
    return this.isInvalidDate(date);
  }

  public isMultipleSelected(d: Date | null): boolean {
    if (!d || this.mode !== 'multiple') return false;
    const dTime = getStartOfDay(d).getTime();
    return this.selectedDates.some(selected => getStartOfDay(selected).getTime() === dTime);
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
    } else if (this.mode === 'multiple') {
      this.selectedDates = this.selectedDates.map(date => {
        const newDate = getStartOfDay(date);
        return this.applyCurrentTime(newDate);
      });
      this.emitValue([...this.selectedDates]);
    }

    this.action.emit({type: 'timeChanged', payload: {hour: this.currentHour, minute: this.currentMinute}});
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.isDateDisabled(day) || this.disabled) return;

    const dateToToggle = getStartOfDay(day);

    if (this.mode === 'single') {
      this.selectedDate = this.applyCurrentTime(day);
      this.emitValue(this.selectedDate);
    } else if (this.mode === 'range') {
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
    } else if (this.mode === 'multiple') {
      const existingIndex = this.selectedDates.findIndex(d => this.isSameDay(d, dateToToggle));

      if (existingIndex > -1) {
        this.selectedDates.splice(existingIndex, 1);
      } else {
        const dateWithTime = this.applyCurrentTime(dateToToggle);
        this.selectedDates.push(dateWithTime);
        this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
      }
      this.emitValue([...this.selectedDates]);
    }

    const dateToSync = this.mode === 'single' ? this.selectedDate :
      this.mode === 'range' ? this.startDate :
        this.mode === 'multiple' && this.selectedDates.length > 0 ? this.selectedDates[this.selectedDates.length - 1] : null;

    if (dateToSync) {
      this.update12HourState(dateToSync.getHours());
      this.currentMinute = dateToSync.getMinutes();
    }

    this.action.emit({
      type: 'dateSelected',
      payload: {
        mode: this.mode,
        value: this._internalValue,
        date: day
      }
    });
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

    // Add previous month's days instead of null values
    const previousMonth = month === 0 ? 11 : month - 1;
    const previousYear = month === 0 ? year - 1 : year;
    const lastDayOfPreviousMonth = new Date(previousYear, previousMonth + 1, 0);
    
    for (let i = 0; i < emptyCellCount; i++) {
      const dayNumber = lastDayOfPreviousMonth.getDate() - emptyCellCount + i + 1;
      this.daysInMonth.push(this._normalizeDate(new Date(previousYear, previousMonth, dayNumber)));
    }
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.daysInMonth.push(this._normalizeDate(new Date(year, month, i)));
    }


    this.action.emit({
      type: 'calendarGenerated',
      payload: {
        month: month,
        year: year,
        days: this.daysInMonth.filter(d => d !== null)
      }
    });
  }

  private generateDropdownOptions(): void {
    this.yearOptions = generateYearOptions(this._currentYear);
  }

  public changeMonth(delta: number): void {
    if (this.disabled) return;

    // Check if going back is disabled due to minDate constraint
    if (delta < 0 && this.isBackArrowDisabled) return;

    const newDate = addMonths(this.currentDate, delta);

    // Update the data immediately (no animation)
    this.currentDate = newDate;
    this._currentMonth = newDate.getMonth();
    this._currentYear = newDate.getFullYear();

    // Generate new calendar view
    this.generateCalendar();

    this.action.emit({type: 'monthChanged', payload: { delta: delta }});
  }

  public isSameDay(d1: Date | null, d2: Date | null): boolean {
    return this.dateComparator(d1, d2);
  }

  public isCurrentMonth(day: Date | null): boolean {
    if (!day) return false;
    return day.getMonth() === this._currentMonth && day.getFullYear() === this._currentYear;
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

  ngOnDestroy(): void {
    // Clean up any subscriptions or timers if needed
    // Currently no cleanup required, but method is here for future optimizations
  }
}