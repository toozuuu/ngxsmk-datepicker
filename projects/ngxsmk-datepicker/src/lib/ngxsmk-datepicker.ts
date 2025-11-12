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
  ChangeDetectorRef,
  PLATFORM_ID,
  effect,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
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
import { 
  DatepickerHooks, 
  KeyboardShortcutContext
} from './interfaces/datepicker-hooks.interface';

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
    <div class="ngxsmk-datepicker-wrapper" [class.ngxsmk-inline-mode]="isInlineMode" [class.ngxsmk-calendar-open]="isCalendarOpen && !isInlineMode" [ngClass]="classes?.wrapper">
      @if (!isInlineMode) {
        <div class="ngxsmk-input-group" (click)="toggleCalendar($event)" (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp($event)" (keydown.enter)="toggleCalendar($event)" (keydown.space)="toggleCalendar($event); $event.preventDefault()" [class.disabled]="disabled" role="button" [attr.aria-disabled]="disabled" aria-haspopup="dialog" [attr.aria-expanded]="isCalendarOpen" tabindex="0" [ngClass]="classes?.inputGroup">
          <input type="text" 
                 [value]="displayValue" 
                 [placeholder]="placeholder" 
                 readonly 
                 [disabled]="disabled"
                 [attr.aria-label]="placeholder || 'Select date'"
                 [attr.aria-describedby]="'datepicker-help-' + _uniqueId"
                 class="ngxsmk-display-input"
                 [ngClass]="classes?.input"
                 (keydown.enter)="toggleCalendar($event)"
                 (keydown.space)="toggleCalendar($event); $event.preventDefault()">
          <button type="button" class="ngxsmk-clear-button" (click)="clearValue($event)" [disabled]="disabled" *ngIf="displayValue" [attr.aria-label]="clearAriaLabel" [title]="clearLabel" [ngClass]="classes?.clearBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
          </button>
        </div>
      }

      @if (isCalendarVisible) {
        @if (!isInlineMode && isCalendarOpen) {
          <div
            class="ngxsmk-backdrop"
            role="button"
            tabindex="0"
            aria-label="Close calendar overlay"
            (click)="onBackdropInteract($event)"
            (keydown.enter)="onBackdropInteract($event)"
            (keydown.space)="onBackdropInteract($event)"
          ></div>
        }
        <div class="ngxsmk-popover-container" [class.ngxsmk-inline-container]="isInlineMode" [class.ngxsmk-popover-open]="isCalendarOpen && !isInlineMode" [ngClass]="classes?.popover">
          <div class="ngxsmk-datepicker-container" [ngClass]="classes?.container">
            @if (showRanges && rangesArray.length > 0 && mode === 'range') {
              <div class="ngxsmk-ranges-container">
                <ul>
                  @for (range of rangesArray; track trackByRange($index, range)) {
                    <li (click)="selectRange(range.value)" (keydown.enter)="selectRange(range.value)" (keydown.space)="selectRange(range.value); $event.preventDefault()" [class.disabled]="disabled" [attr.tabindex]="disabled ? -1 : 0" role="button" [attr.aria-disabled]="disabled">{{ range.key }}</li>
                  }
                </ul>
              </div>
            }
            <div class="ngxsmk-calendar-container" [ngClass]="classes?.calendar">
              <div class="ngxsmk-header" [ngClass]="classes?.header">
                <div class="ngxsmk-month-year-selects">
                  <ngxsmk-custom-select class="month-select" [options]="monthOptions"
                                    [(value)]="currentMonth" [disabled]="disabled"></ngxsmk-custom-select>
                  <ngxsmk-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear" [disabled]="disabled"></ngxsmk-custom-select>
                </div>
                <div class="ngxsmk-nav-buttons">
                  <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(-1)" [disabled]="disabled || isBackArrowDisabled" [attr.aria-label]="prevMonthAriaLabel" [title]="prevMonthAriaLabel" [ngClass]="classes?.navPrev">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                            d="M328 112L184 256l144 144"/>
                    </svg>
                  </button>
                  <button type="button" class="ngxsmk-nav-button" (click)="changeMonth(1)" [disabled]="disabled" [attr.aria-label]="nextMonthAriaLabel" [title]="nextMonthAriaLabel" [ngClass]="classes?.navNext">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                            d="M184 112l144 144-144 144"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="ngxsmk-days-grid-wrapper">
                <div class="ngxsmk-days-grid" role="grid" [attr.aria-label]="'Calendar for ' + (currentDate | date : 'MMMM yyyy')">
                  @for (day of weekDays; track day) {
                    <div class="ngxsmk-day-name">{{ day }}</div>
                  }
                  @for (day of daysInMonth; track trackByDay($index, day)) {
                    <div class="ngxsmk-day-cell" [ngClass]="classes?.dayCell"
                        [class.empty]="!isCurrentMonthMemo(day)" [class.disabled]="isDateDisabledMemo(day)" 
                        [class.today]="isSameDayMemo(day, today)"
                        [class.holiday]="isHolidayMemo(day)"
                        [class.selected]="mode === 'single' && isSameDayMemo(day, selectedDate)"
                        [class.multiple-selected]="mode === 'multiple' && isMultipleSelected(day)"
                        [class.start-date]="mode === 'range' && isSameDayMemo(day, startDate)"
                        [class.end-date]="mode === 'range' && isSameDayMemo(day, endDate)"
                        [class.in-range]="mode === 'range' && isInRange(day)"
                        [class.preview-range]="isPreviewInRange(day)"
                        [class.focused]="day && focusedDate && isSameDayMemo(day, focusedDate)"
                        [attr.tabindex]="day && !isDateDisabledMemo(day) ? 0 : -1"
                        [attr.role]="day ? 'gridcell' : null"
                        [attr.aria-selected]="day && (mode === 'single' && isSameDayMemo(day, selectedDate)) ? 'true' : null"
                        [attr.aria-label]="day ? getAriaLabel(day) : null"
                        [ngClass]="getDayCellCustomClasses(day)"
                        [attr.title]="day ? getDayCellTooltip(day) : null"
                        [attr.data-date]="day ? day.getTime() : null"
                        (click)="onDateClick(day)" 
                        (keydown.enter)="onDateClick(day)"
                        (keydown.space)="onDateClick(day); $event.preventDefault()"
                        (mouseenter)="onDateHover(day)"
                        (focus)="onDateFocus(day)">
                      @if (day) {
                        <div class="ngxsmk-day-number">{{ formatDayNumber(day) }}</div>
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
              
              <div class="ngxsmk-footer" *ngIf="!isInlineMode" [ngClass]="classes?.footer">
                <button type="button" class="ngxsmk-clear-button-footer" (click)="clearValue($event)" [disabled]="disabled" [attr.aria-label]="clearAriaLabel" [ngClass]="classes?.clearBtn">
                  {{ clearLabel }}
                </button>
                <button type="button" class="ngxsmk-close-button" (click)="isCalendarOpen = false" [disabled]="disabled" [attr.aria-label]="closeAriaLabel" [ngClass]="classes?.closeBtn">
                  {{ closeLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class NgxsmkDatepickerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit, ControlValueAccessor {
  private static _idCounter = 0;
  public _uniqueId = `ngxsmk-datepicker-${NgxsmkDatepickerComponent._idCounter++}`;
  
  @Input() mode: 'single' | 'range' | 'multiple' = 'single';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() minuteInterval: number = 1;
  @Input() holidayProvider: HolidayProvider | null = null;
  @Input() disableHolidays: boolean = false;
  @Input() disabledDates: (string | Date)[] = [];
  @Input() placeholder: string = 'Select Date';
  @Input() inline: boolean | 'always' | 'auto' = false;
  @Input() clearLabel: string = 'Clear';
  @Input() closeLabel: string = 'Close';
  @Input() prevMonthAriaLabel: string = 'Previous month';
  @Input() nextMonthAriaLabel: string = 'Next month';
  @Input() clearAriaLabel: string = 'Clear selection';
  @Input() closeAriaLabel: string = 'Close calendar';
  @Input() weekStart: number | null = null;
  @Input() yearRange: number = 10;
  @Input() hooks: DatepickerHooks | null = null;
  @Input() enableKeyboardShortcuts: boolean = true;
  @Input() customShortcuts: { [key: string]: (context: KeyboardShortcutContext) => boolean } | null = null;
  @Input() autoApplyClose: boolean = false;
  public isCalendarOpen: boolean = false;
  private isOpeningCalendar: boolean = false;
  private openCalendarTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private lastToggleTime: number = 0;
  private touchStartTime: number = 0;
  private touchStartElement: EventTarget | null = null;
  private pointerDownTime: number = 0;
  private isPointerEvent: boolean = false;

  public _internalValue: DatepickerValue = null;

  private _value: DatepickerValue = null;
  @Input() set value(val: DatepickerValue) {
    this._value = val;
    if (!this._field && val !== undefined) {
      let normalizedValue: DatepickerValue = null;
      if (val !== null) {
        if (val instanceof Date) {
          normalizedValue = this._normalizeDate(val) as DatepickerValue;
        } else if (typeof val === 'object' && 'start' in val && 'end' in val) {
          normalizedValue = {
            start: this._normalizeDate(val.start),
            end: this._normalizeDate(val.end)
          } as DatepickerValue;
        } else if (Array.isArray(val)) {
          normalizedValue = val.map(d => this._normalizeDate(d)).filter((d): d is Date => d !== null) as DatepickerValue;
        }
      }
      if (!this.isValueEqual(normalizedValue, this._internalValue)) {
        this._internalValue = normalizedValue;
        this.initializeValue(normalizedValue);
        this.generateCalendar();
        this.cdr.markForCheck();
      }
    }
  }
  get value(): DatepickerValue {
    return this._internalValue;
  }

  private _field: any = null;
  
  @Input() set field(field: any) {
    this._field = field;
    if (field) {
      try {
        effect(() => {
            let fieldValue: any = null;
            
            if (typeof field.value === 'function') {
              fieldValue = field.value();
            } else if (field.value !== undefined) {
              fieldValue = field.value;
            }
            
            const normalizedValue = fieldValue !== null && fieldValue !== undefined
              ? (this._normalizeDate(fieldValue) as DatepickerValue)
              : null;
            
            if (!this.isValueEqual(normalizedValue, this._internalValue)) {
              this._internalValue = normalizedValue;
              this.initializeValue(normalizedValue);
              this.generateCalendar();
              this.cdr.markForCheck();
            }
            
            if (typeof field.disabled === 'function') {
              const newDisabled = field.disabled();
              if (this.disabled !== newDisabled) {
                this.disabled = newDisabled;
                this.cdr.markForCheck();
              }
            } else if (field.disabled !== undefined && this.disabled !== field.disabled) {
              this.disabled = field.disabled;
              this.cdr.markForCheck();
            }
        });
      } catch {
        this.syncFieldValue(field);
      }
    }
  }
  get field(): any {
    return this._field;
  }
  
  private syncFieldValue(field: any): void {
    const fieldValue = typeof field.value === 'function' ? field.value() : field.value;
    const normalizedValue = fieldValue !== null && fieldValue !== undefined
      ? (this._normalizeDate(fieldValue) as DatepickerValue)
      : null;
    if (!this.isValueEqual(normalizedValue, this._internalValue)) {
      this._internalValue = normalizedValue;
      this.initializeValue(normalizedValue);
      this.generateCalendar();
      this.cdr.markForCheck();
    }
    
    if (typeof field.disabled === 'function') {
      this.disabled = field.disabled();
    } else if (field.disabled !== undefined) {
      this.disabled = field.disabled;
    }
  }

  private _startAtDate: Date | null = null;
  @Input() set startAt(value: DateInput | null) { this._startAtDate = this._normalizeDate(value); }

  private _locale: string = 'en-US';
  @Input() set locale(value: string) { this._locale = value; }
  get locale(): string { return this._locale; }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() { return this.theme === 'dark'; }

  @Input() classes?: {
    wrapper?: string;
    inputGroup?: string;
    input?: string;
    clearBtn?: string;
    popover?: string;
    container?: string;
    calendar?: string;
    header?: string;
    navPrev?: string;
    navNext?: string;
    dayCell?: string;
    footer?: string;
    closeBtn?: string;
  };

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

  // Touch tracking for date cells
  private dateCellTouchStartTime: number = 0;
  private dateCellTouchStartDate: Date | null = null;
  private dateCellTouchStartX: number = 0;
  private dateCellTouchStartY: number = 0;
  private isDateCellTouching: boolean = false;
  private lastDateCellTouchDate: Date | null = null;
  private dateCellTouchHandled: boolean = false;

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

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly dateComparator = createDateComparator();
  
  // Track passive listeners for cleanup
  private passiveTouchListeners: Array<() => void> = [];
  
  get isInlineMode(): boolean {
    if (this.inline === true || this.inline === 'always') {
      return true;
    }
    if (this.inline === 'auto' && this.isBrowser) {
      try {
        return window.matchMedia('(min-width: 768px)').matches;
      } catch {
        return false;
      }
    }
    return false;
  }

  private isMobileDevice(): boolean {
    if (this.isBrowser) {
      try {
        return window.matchMedia('(max-width: 1024px)').matches;
      } catch {
        // Fallback: check user agent or touch support
        return 'ontouchstart' in window || (navigator as any).maxTouchPoints > 0;
      }
    }
    return false;
  }

  get isCalendarVisible(): boolean {
    return this.isInlineMode || this.isCalendarOpen;
  }
  
  get displayValue(): string {
    if (this.hooks?.formatDisplayValue) {
      return this.hooks.formatDisplayValue(this._internalValue, this.mode);
    }
    
    if (this.mode === 'single' && this.selectedDate) {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit'
      };
      
      if (this.showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      return this.selectedDate.toLocaleString(this.locale, options);
    } else if (this.mode === 'range' && this.startDate) {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      };
      if (this.endDate) {
        // Both dates selected - show range
      const start = this.startDate.toLocaleString(this.locale, options);
      const end = this.endDate.toLocaleString(this.locale, options);
      return `${start} - ${end}`;
      } else {
        // Only start date selected - show start date with indicator
        const start = this.startDate.toLocaleString(this.locale, options);
        return `${start}...`;
      }
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return `${this.selectedDates.length} dates selected`;
    }
    return '';
  }

  get isBackArrowDisabled(): boolean {
    if (!this._minDate) return false;
    const firstDayOfCurrentMonth = new Date(this.currentYear, this.currentMonth, 1);
    return firstDayOfCurrentMonth <= this._minDate;
  }
  get isCurrentMonthMemo(): (day: Date | null) => boolean {
    return (day: Date | null) => {
      if (!day) return false;
      return day.getMonth() === this._currentMonth && day.getFullYear() === this._currentYear;
    };
  }

  get isDateDisabledMemo(): (day: Date | null) => boolean {
    return (day: Date | null) => {
      if (!day) return false;
      return this.isDateDisabled(day);
    };
  }

  get isSameDayMemo(): (d1: Date | null, d2: Date | null) => boolean {
    return (d1: Date | null, d2: Date | null) => this.dateComparator(d1, d2);
  }

  get isHolidayMemo(): (day: Date | null) => boolean {
    return (day: Date | null) => {
      if (!day || !this.holidayProvider) return false;
      const dateOnly = getStartOfDay(day);
      return this.holidayProvider.isHoliday(dateOnly);
    };
  }

  get getHolidayLabelMemo(): (day: Date | null) => string | null {
    return (day: Date | null) => {
      if (!day || !this.holidayProvider || !this.isHolidayMemo(day)) return null;
      return this.holidayProvider.getHolidayLabel ? this.holidayProvider.getHolidayLabel(getStartOfDay(day)) : 'Holiday';
    };
  }

  trackByDay(index: number, day: Date | null): string {
    return day ? day.getTime().toString() : `empty-${index}`;
  }

  trackByRange(_index: number, range: { key: string; value: [Date, Date] }): string {
    return range.key;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent | TouchEvent): void {
    if (!this.isBrowser || this.isInlineMode) {
      return;
    }
    
      const target = event.target as Node;
      const nativeElement = this.elementRef.nativeElement;
      
    if (!target || !nativeElement) {
        return;
    }
    
    // Check if click originated from within the datepicker component
    if (nativeElement.contains(target)) {
      // Click was inside the datepicker, don't close
      return;
    }
    
    if (!this.isCalendarOpen) {
      return;
    }
    
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    
    // On mobile, give more time for the modal to appear before allowing outside clicks to close
    const protectionTime = this.isMobileDevice() ? 600 : 300;
    
    // Protect against immediate closes - this is critical for modal reliability
    // Increase protection time and check opening state
    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      // Within protection window, ignore outside clicks to prevent accidental closes
      return;
    }
    
    // Only close if click/touch is outside the datepicker and protection time has passed
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.cdr.markForCheck();
  }

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouchStart(event: TouchEvent): void {
    if (!this.isBrowser || this.isInlineMode) {
      return;
    }
    
      const target = event.target as Node;
    const nativeElement = this.elementRef.nativeElement;
    
    if (!target || !nativeElement) {
        return;
      }
    
    // Check if touch originated from within the datepicker component
    if (nativeElement.contains(target)) {
      // Touch was inside the datepicker, don't close
      return;
    }
    
    if (!this.isCalendarOpen) {
      return;
    }
    
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    const protectionTime = this.isMobileDevice() ? 600 : 300;
    
    // Protect against immediate closes on mobile
    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      // Within protection window, ignore outside touches to prevent accidental closes
      return;
    }
    
    // Only close if touch is outside the datepicker and protection time has passed
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.cdr.markForCheck();
  }

  public onTouchStart(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      return;
    }
    // Record touch start for tap detection
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget;
    // Don't prevent default or stop propagation here to allow normal touch behavior
  }

  public onTouchEnd(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    const now = Date.now();
    const timeSinceTouch = this.touchStartTime > 0 ? now - this.touchStartTime : 0;
    
    // Only process if touch was quick (tap, not scroll) - increased timeout for better reliability
    // Also check if touch was on the same element
    const touch = event.changedTouches[0];
    const isSameElement = touch && this.touchStartElement && 
      (touch.target === this.touchStartElement || 
       (this.touchStartElement as Node).contains && 
       (this.touchStartElement as Node).contains(touch.target as Node));
    
    if (this.touchStartTime === 0 || timeSinceTouch > 800 || !isSameElement) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    // Prevent rapid toggling
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    // Prevent default to avoid double-firing with click event
    event.preventDefault();
    event.stopPropagation();
    
    const wasOpen = this.isCalendarOpen;
    
    if (!wasOpen) {
      // Opening calendar - ensure it opens reliably
      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
    this.lastToggleTime = now;
      
      // Clear touch tracking
    this.touchStartTime = 0;
      this.touchStartElement = null;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }
      
      this.updateOpeningState(true);
      
      // Force immediate change detection to show modal - critical for mobile reliability
      this.cdr.detectChanges();
      
      // Also use requestAnimationFrame as backup to ensure DOM is updated
      // Use double RAF to ensure modal is fully rendered before allowing outside clicks
      if (this.isBrowser) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.cdr.detectChanges();
            // Clear opening flag after modal is fully rendered
            if (this.isOpeningCalendar) {
              setTimeout(() => {
                this.isOpeningCalendar = false;
    this.cdr.markForCheck();
              }, 150);
            }
          });
        });
      }
    } else {
      // Closing calendar
      this.isCalendarOpen = false;
      this.isOpeningCalendar = false;
      this.lastToggleTime = now;
      
      // Clear touch tracking
      this.touchStartTime = 0;
      this.touchStartElement = null;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }
      
      this.updateOpeningState(false);
      this.cdr.detectChanges();
    }
  }

  public onPointerDown(event: PointerEvent): void {
    if (this.disabled || this.isInlineMode || event.pointerType === 'mouse') {
      return;
    }
    this.isPointerEvent = true;
    this.pointerDownTime = Date.now();
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget;
  }

  public onPointerUp(event: PointerEvent): void {
    if (this.disabled || this.isInlineMode || !this.isPointerEvent || event.pointerType === 'mouse') {
      this.isPointerEvent = false;
      return;
    }
    
    const now = Date.now();
    const timeSincePointerDown = this.pointerDownTime > 0 ? now - this.pointerDownTime : 0;
    
    if (this.pointerDownTime === 0 || timeSincePointerDown > 600) {
      this.isPointerEvent = false;
      this.pointerDownTime = 0;
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    const wasOpen = this.isCalendarOpen;
    this.isPointerEvent = false;
    this.pointerDownTime = 0;
    this.touchStartTime = 0;
    this.touchStartElement = null;
    
    if (!wasOpen) {
      // Opening calendar
      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
    this.lastToggleTime = now;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }
      
      this.updateOpeningState(true);
      
      // Force immediate change detection - critical for mobile reliability
      this.cdr.detectChanges();
      
      // Also use requestAnimationFrame as backup
      if (this.isBrowser) {
        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
        
        this.openCalendarTimeoutId = setTimeout(() => {
          this.isOpeningCalendar = false;
          this.openCalendarTimeoutId = null;
    this.cdr.markForCheck();
        }, 350);
      }
    } else {
      // Closing calendar
      this.isCalendarOpen = false;
      this.isOpeningCalendar = false;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }
      
      this.updateOpeningState(false);
      this.cdr.detectChanges();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isCalendarVisible || this.disabled) return;
    
    const target = event.target as HTMLElement;
    const isCalendarFocused = target?.closest('.ngxsmk-days-grid') !== null;
    
    if (isCalendarFocused || event.key === 'Escape') {
      const handled = this.handleKeyboardNavigation(event);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private handleKeyboardNavigation(event: KeyboardEvent): boolean {
    if (!this.enableKeyboardShortcuts) {
      return false;
    }

    const context: KeyboardShortcutContext = {
      currentDate: this.currentDate,
      selectedDate: this.selectedDate,
      startDate: this.startDate,
      endDate: this.endDate,
      selectedDates: this.selectedDates,
      mode: this.mode,
      focusedDate: this.focusedDate,
      isCalendarOpen: this.isCalendarOpen
    };

    if (this.customShortcuts) {
      const key = this.getShortcutKey(event);
      if (key && this.customShortcuts[key]) {
        const handled = this.customShortcuts[key](context);
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
      }
    }

    if (this.hooks?.handleShortcut) {
      const handled = this.hooks.handleShortcut(event, context);
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateDate(-1, 0);
        return true;
      case 'ArrowRight':
        this.navigateDate(1, 0);
        return true;
      case 'ArrowUp':
        this.navigateDate(0, -1);
        return true;
      case 'ArrowDown':
        this.navigateDate(0, 1);
        return true;
      case 'PageUp':
        if (event.shiftKey) {
          this.currentYear = this.currentYear - 1;
        } else {
          this.changeMonth(-1);
        }
        return true;
      case 'PageDown':
        if (event.shiftKey) {
          this.currentYear = this.currentYear + 1;
        } else {
          this.changeMonth(1);
        }
        return true;
      case 'Home':
        this.navigateToFirstDay();
        return true;
      case 'End':
        this.navigateToLastDay();
        return true;
      case 'Enter':
      case ' ':
        if (this.focusedDate) {
          this.onDateClick(this.focusedDate);
        }
        return true;
      case 'Escape':
        if (!this.isInlineMode) {
          this.isCalendarOpen = false;
          this.cdr.markForCheck();
        }
        return true;
      case 't':
      case 'T':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectToday();
          return true;
        }
        return false;
      case 'y':
      case 'Y':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectYesterday();
          return true;
        }
        return false;
      case 'n':
      case 'N':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectTomorrow();
          return true;
        }
        return false;
      case 'w':
      case 'W':
        if (!event.ctrlKey && !event.metaKey) {
          this.selectNextWeek();
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  private getShortcutKey(event: KeyboardEvent): string | null {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.metaKey) parts.push('Meta');
    if (event.shiftKey) parts.push('Shift');
    if (event.altKey) parts.push('Alt');
    parts.push(event.key);
    return parts.length > 1 ? parts.join('+') : event.key;
  }

  public focusedDate: Date | null = null;

  private navigateDate(days: number, weeks: number): void {
    const baseDate = this.focusedDate || this.currentDate || new Date();
    const newDate = new Date(baseDate);
    newDate.setDate(newDate.getDate() + days + (weeks * 7));
    
    if (this.isDateValid(newDate)) {
      this.focusedDate = newDate;
      this.currentDate = new Date(newDate);
      this.currentDate.setDate(1);
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  private navigateToFirstDay(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    if (this.isDateValid(firstDay)) {
      this.focusedDate = firstDay;
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  private navigateToLastDay(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    if (this.isDateValid(lastDay)) {
      this.focusedDate = lastDay;
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  private selectToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this.isDateValid(today)) {
      this.focusedDate = today;
      this.onDateClick(today);
    }
  }

  private selectYesterday(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    if (this.isDateValid(yesterday)) {
      this.focusedDate = yesterday;
      this.onDateClick(yesterday);
    }
  }

  private selectTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (this.isDateValid(tomorrow)) {
      this.focusedDate = tomorrow;
      this.onDateClick(tomorrow);
    }
  }

  private selectNextWeek(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    if (this.isDateValid(nextWeek)) {
      this.focusedDate = nextWeek;
      this.currentDate = new Date(nextWeek);
      this.currentDate.setDate(1);
      this.generateCalendar();
      this.onDateClick(nextWeek);
    }
  }

  onDateFocus(day: Date | null): void {
    if (day) {
      this.focusedDate = day;
    }
  }

  private isDateValid(date: Date): boolean {
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    if (this.isInvalidDate && this.isInvalidDate(date)) return false;
    if (this.isDateDisabledMemo(date)) return false;
    
    if (this.hooks?.validateDate) {
      if (!this.hooks.validateDate(date, this._internalValue, this.mode)) {
        return false;
      }
    }
    
    return true;
  }

  getDayCellCustomClasses(day: Date | null): string[] {
    if (!day || !this.hooks?.getDayCellClasses) return [];
    
    const isSelected = this.mode === 'single' && this.isSameDayMemo(day, this.selectedDate) ||
                      this.mode === 'multiple' && this.isMultipleSelected(day) ||
                      this.mode === 'range' && (this.isSameDayMemo(day, this.startDate) || this.isSameDayMemo(day, this.endDate));
    const isDisabled = this.isDateDisabledMemo(day);
    const isToday = this.isSameDayMemo(day, this.today);
    const isHoliday = this.isHolidayMemo(day);
    
    return this.hooks.getDayCellClasses(day, isSelected, isDisabled, isToday, isHoliday) || [];
  }

  getDayCellTooltip(day: Date | null): string | null {
    if (!day) return null;
    
    const holidayLabel = this.getHolidayLabelMemo(day);
    
    if (this.hooks?.getDayCellTooltip) {
      const customTooltip = this.hooks.getDayCellTooltip(day, holidayLabel);
      if (customTooltip !== null) return customTooltip;
    }
    
    return holidayLabel;
  }

  formatDayNumber(day: Date | null): string {
    if (!day) return '';
    
    if (this.hooks?.formatDayNumber) {
      return this.hooks.formatDayNumber(day);
    }
    
    return day.getDate().toString();
  }

  getAriaLabel(day: Date | null): string {
    if (!day) return '';
    
    if (this.hooks?.formatAriaLabel) {
      return this.hooks.formatAriaLabel(day);
    }
    
    return day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }


  writeValue(val: DatepickerValue): void {
    this._internalValue = val;
    this.initializeValue(val);
    this.generateCalendar();
    this.cdr.markForCheck();
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
    
    if (this._field) {
      try {
        if (typeof this._field.setValue === 'function') {
          this._field.setValue(val);
        } else if (typeof this._field.updateValue === 'function') {
          this._field.updateValue(() => val);
        } else if (typeof this._field.value === 'function') {
          if (typeof this._field.value.set === 'function') {
            this._field.value.set(val);
          } else {
            try {
              const valueSignal = this._field.value();
              if (valueSignal && typeof valueSignal.set === 'function') {
                valueSignal.set(val);
              }
            } catch {
            }
          }
        } else if (this._field.value && typeof this._field.value.set === 'function') {
          this._field.value.set(val);
        }
      } catch {
      }
    }
    
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
    
    if (!this.isInlineMode && val !== null) {
      if (this.mode === 'single' || (this.mode === 'range' && this.startDate && this.endDate)) {
        this.isCalendarOpen = false;
      }
    }
  }
  
  public toggleCalendar(event?: Event): void {
    if (this.disabled || this.isInlineMode) return;
    
    // Prevent rapid toggling - debounce clicks
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      // Too soon after last toggle, ignore
      return;
    }
    
    if (!event) {
      const wasOpen = this.isCalendarOpen;
      this.isCalendarOpen = !this.isCalendarOpen;
      this.lastToggleTime = now;
      this.updateOpeningState(!wasOpen && this.isCalendarOpen);
      this.cdr.detectChanges();
      return;
    }
    
    // Ignore touch events - handled by onTouchEnd
    if (event.type === 'touchstart' || event.type === 'touchend') {
      return;
    }
    
    if (event.type === 'click') {
      const now = Date.now();
      
      // If this click happened shortly after a touch event on the same element, ignore it
      // This prevents double-firing on mobile devices
      if (this.touchStartElement && this.touchStartTime > 0) {
        const timeSinceTouch = now - this.touchStartTime;
        if (timeSinceTouch < 800 && (this.touchStartElement === event.target || 
            (event.target as Node) && this.touchStartElement && 
            (this.touchStartElement as Node).contains && 
            (this.touchStartElement as Node).contains(event.target as Node))) {
          // Touch event already handled this, ignore click
          this.touchStartTime = 0;
          this.touchStartElement = null;
          return;
        }
      }
      
      // Debounce rapid clicks
      if (now - this.lastToggleTime < 300) {
        return;
      }
      
      this.lastToggleTime = now;
    }
    
    event.stopPropagation();
    
    const wasOpen = this.isCalendarOpen;
    this.isCalendarOpen = !this.isCalendarOpen;
    this.updateOpeningState(!wasOpen && this.isCalendarOpen);
    
    // Force change detection for immediate UI update
    this.cdr.detectChanges();
  }

  public onBackdropInteract(event: Event): void {
    event.stopPropagation();
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.updateOpeningState(false);
    this.lastToggleTime = Date.now();
    this.cdr.markForCheck();
  }

  private updateOpeningState(isOpening: boolean): void {
    if (isOpening) {
      this.isOpeningCalendar = true;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }
      
      // Reduced timeout for faster interaction, but still protect against accidental closes
      this.openCalendarTimeoutId = setTimeout(() => {
        this.isOpeningCalendar = false;
        this.openCalendarTimeoutId = null;
        this.cdr.markForCheck();
      }, 200);
    } else {
      this.isOpeningCalendar = false;
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
        this.openCalendarTimeoutId = null;
      }
    }
  }

  private closeCalendar(): void {
    if (!this.isInlineMode) {
      this.isCalendarOpen = false;
      this.cdr.markForCheck();
    }
  }

  private shouldAutoClose(): boolean {
    if (!this.autoApplyClose || this.showTime || this.isInlineMode) {
      return false;
    }

    if (this.mode === 'single') {
      return this.selectedDate !== null;
    } else if (this.mode === 'range') {
      return this.startDate !== null && this.endDate !== null;
    }

    return false;
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
    this.currentDate = new Date();
    this._currentMonth = this.currentDate.getMonth();
    this._currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  get currentMonth(): number { return this._currentMonth; }

  set currentMonth(month: number) {
    if (this.disabled) return;
    if (this._currentMonth !== month) {
      this._currentMonth = month;
      this.currentDate.setMonth(month);
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  get currentYear(): number { return this._currentYear; }

  set currentYear(year: number) {
    if (this.disabled) return;
    if (this._currentYear !== year) {
      this._currentYear = year;
      this.currentDate.setFullYear(year);
      this.generateCalendar();
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (this._locale === 'en-US' && this.isBrowser && typeof navigator !== 'undefined' && navigator.language) {
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

    let initialValue: DatepickerValue = null;
    if (this._field) {
      const fieldValue = typeof this._field.value === 'function' ? this._field.value() : this._field.value;
      if (fieldValue !== undefined && fieldValue !== null) {
        initialValue = this._normalizeDate(fieldValue) as DatepickerValue;
      }
    } else if (this._value !== null) {
      initialValue = this._value;
    } else if (this._internalValue !== null) {
      initialValue = this._internalValue;
    }
    
    if (initialValue) {
      this.initializeValue(initialValue);
      this._internalValue = initialValue;
    } else {
      this.initializeValue(null);
    }
    this.generateCalendar();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Add passive touch event listeners to date cells to avoid scroll-blocking warnings
      // Use multiple attempts to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupPassiveTouchListeners();
          this.setupInputGroupPassiveListeners();
          
          // Also setup after a short delay as fallback
          setTimeout(() => {
            this.setupInputGroupPassiveListeners();
          }, 100);
        });
      });
    }
  }

  private setupInputGroupPassiveListeners(): void {
    // Retry if element not found (DOM might not be ready)
    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) {
      // Retry after a short delay
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    const inputGroup = nativeElement.querySelector('.ngxsmk-input-group') as HTMLElement;
    if (!inputGroup) {
      // Retry after a short delay
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    // Check if listeners already exist to avoid duplicates
    if ((inputGroup as any).__ngxsmk_touch_listeners_setup) {
      return;
    }
    (inputGroup as any).__ngxsmk_touch_listeners_setup = true;

    // onTouchStart doesn't call preventDefault, so it can be passive
    const touchStartHandler = (event: TouchEvent) => {
      this.onTouchStart(event);
    };
    inputGroup.addEventListener('touchstart', touchStartHandler, { passive: true });

    // onTouchEnd calls preventDefault, so it must be non-passive
    const touchEndHandler = (event: TouchEvent) => {
      this.onTouchEnd(event);
    };
    inputGroup.addEventListener('touchend', touchEndHandler, { passive: false });

    // Store cleanup
    this.passiveTouchListeners.push(() => {
      (inputGroup as any).__ngxsmk_touch_listeners_setup = false;
      inputGroup.removeEventListener('touchstart', touchStartHandler);
      inputGroup.removeEventListener('touchend', touchEndHandler);
    });
  }

  private setupPassiveTouchListeners(): void {
    // Clean up existing listeners first
    this.passiveTouchListeners.forEach(cleanup => cleanup());
    this.passiveTouchListeners = [];

    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) return;

    // Find all date cells
    const dateCells = nativeElement.querySelectorAll('.ngxsmk-day-cell[data-date]');
    
    dateCells.forEach((cell: HTMLElement) => {
      const dateTimestamp = cell.getAttribute('data-date');
      if (!dateTimestamp) return;
      
      const dateValue = parseInt(dateTimestamp, 10);
      if (isNaN(dateValue)) return;
      
      const day = new Date(dateValue);
      if (!day || isNaN(day.getTime())) return;

      // Use native addEventListener with passive option for touchstart (doesn't call preventDefault)
      const touchStartHandler = (event: TouchEvent) => {
        this.onDateCellTouchStart(event, day);
      };
      cell.addEventListener('touchstart', touchStartHandler, { passive: true });

      // touchend may need preventDefault, so non-passive
      const touchEndHandler = (event: TouchEvent) => {
        this.onDateCellTouchEnd(event, day);
      };
      cell.addEventListener('touchend', touchEndHandler, { passive: false });

      // touchmove may need preventDefault for range selection, so non-passive
      const touchMoveHandler = (event: TouchEvent) => {
        this.onDateCellTouchMove(event);
      };
      cell.addEventListener('touchmove', touchMoveHandler, { passive: false });

      // Store cleanup functions
      this.passiveTouchListeners.push(() => {
        cell.removeEventListener('touchstart', touchStartHandler);
        cell.removeEventListener('touchend', touchEndHandler);
        cell.removeEventListener('touchmove', touchMoveHandler);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locale']) {
      this.generateLocaleData();
      this.generateCalendar();
      this.cdr.markForCheck();
    }
    if (changes['weekStart']) {
      this.generateLocaleData();
      this.generateCalendar();
      this.cdr.markForCheck();
    }

    if (changes['minuteInterval']) {
      this.generateTimeOptions();
      this.currentMinute = Math.floor(this.currentMinute / this.minuteInterval) * this.minuteInterval;
      this.onTimeChange();
    }
    if (changes['yearRange']) {
      this.generateDropdownOptions();
      this.cdr.markForCheck();
    }

    if (changes['field']) {
      const newField = changes['field'].currentValue;
      if (newField) {
        const fieldValue = typeof newField.value === 'function' ? newField.value() : newField.value;
        if (fieldValue !== undefined && fieldValue !== null) {
          const normalizedValue = this._normalizeDate(fieldValue) as DatepickerValue;
          if (!this.isValueEqual(normalizedValue, this._internalValue)) {
            this._internalValue = normalizedValue;
            this.initializeValue(normalizedValue);
            this.generateCalendar();
            this.cdr.markForCheck();
          }
        }
      }
    }
    
    if (changes['value']) {
      if (!this._field) {
        const newValue = changes['value'].currentValue;
        if (!this.isValueEqual(newValue, this._internalValue)) {
          this._internalValue = newValue;
          this.initializeValue(newValue);
          this.generateCalendar();
          this.cdr.markForCheck();
        }
      }
    }
    
    if (changes['holidayProvider'] || changes['disableHolidays'] || changes['disabledDates']) {
        this.generateCalendar();
        this.cdr.markForCheck();
    }

    if (changes['startAt']) {
      if (!this._internalValue && this._startAtDate) {
        this.currentDate = new Date(this._startAtDate);
        this._currentMonth = this.currentDate.getMonth();
        this._currentYear = this.currentDate.getFullYear();
        this.generateCalendar();
        this.cdr.markForCheck();
      }
    }

    if (changes['minDate']) {
      this.generateCalendar();
      this.cdr.markForCheck();
      
      if (!this._internalValue && this._minDate) {
        const today = new Date();
        const minDateOnly = getStartOfDay(this._minDate);
        const todayOnly = getStartOfDay(today);
        
        if (minDateOnly.getTime() > todayOnly.getTime()) {
          this.currentDate = new Date(this._minDate);
          this._currentMonth = this.currentDate.getMonth();
          this._currentYear = this.currentDate.getFullYear();
          this.generateCalendar();
          this.cdr.markForCheck();
        }
      }
    }
    
    if (changes['maxDate']) {
      this.generateCalendar();
      this.cdr.markForCheck();
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

    let viewCenterDate = initialDate || this._startAtDate;
    
    if (!viewCenterDate && this._minDate) {
      const today = new Date();
      const minDateOnly = getStartOfDay(this._minDate);
      const todayOnly = getStartOfDay(today);
      
      if (minDateOnly.getTime() > todayOnly.getTime()) {
        viewCenterDate = this._minDate;
      }
    }
    
    if (!viewCenterDate) {
      viewCenterDate = new Date();
    }

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

  private isValueEqual(val1: DatepickerValue, val2: DatepickerValue): boolean {
    if (val1 === val2) return true;
    if (val1 === null || val2 === null) return val1 === val2;
    
    if (val1 instanceof Date && val2 instanceof Date) {
      return val1.getTime() === val2.getTime();
    }
    
    if (typeof val1 === 'object' && typeof val2 === 'object' && 
        'start' in val1 && 'end' in val1 && 'start' in val2 && 'end' in val2) {
      const r1 = val1 as { start: Date, end: Date };
      const r2 = val2 as { start: Date, end: Date };
      return r1.start.getTime() === r2.start.getTime() && 
             r1.end.getTime() === r2.end.getTime();
    }
    
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) return false;
      return val1.every((d1, i) => {
        const d2 = val2[i];
        return d1 && d2 && d1.getTime() === d2.getTime();
      });
    }
    
    return false;
  }

  private parseDateString(dateString: string): Date | null {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return getStartOfDay(date);
    } catch {
      return null;
    }
  }

  private generateTimeOptions(): void {
    const { hourOptions, minuteOptions } = generateTimeOptions(this.minuteInterval);
    this.hourOptions = hourOptions;
    this.minuteOptions = minuteOptions;
  }

  private generateLocaleData(): void {
    const year = new Date().getFullYear();
    this.monthOptions = generateMonthOptions(this.locale, year);
    this.firstDayOfWeek = this.weekStart !== null && this.weekStart !== undefined
      ? this.weekStart
      : getFirstDayOfWeek(this.locale);
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
    
    if (this.shouldAutoClose()) {
      this.closeCalendar();
    }
    
    this.cdr.markForCheck();
  }
  
  public isHoliday(date: Date | null): boolean {
    if (!date || !this.holidayProvider) return false;
    const dateOnly = getStartOfDay(date);
    return this.holidayProvider.isHoliday(dateOnly);
  }
  
  public getHolidayLabel(date: Date | null): string | null {
    if (!date || !this.holidayProvider || !this.isHoliday(date)) return null;
    return this.holidayProvider.getHolidayLabel ? this.holidayProvider.getHolidayLabel(getStartOfDay(date)) : 'Holiday';
  }

  public isDateDisabled(date: Date | null): boolean {
    if (!date) return false;

    const dateOnly = getStartOfDay(date);

    if (this.disabledDates.length > 0) {
      for (const disabledDate of this.disabledDates) {
        let parsedDate: Date | null;
        
        if (typeof disabledDate === 'string') {
          parsedDate = this.parseDateString(disabledDate);
        } else {
          parsedDate = getStartOfDay(disabledDate);
        }
        
        if (parsedDate && dateOnly.getTime() === parsedDate.getTime()) {
          return true;
        }
      }
    }

    if (this.holidayProvider && this.disableHolidays && this.holidayProvider.isHoliday(dateOnly)) {
      return true;
    }

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
    this.cdr.markForCheck();
  }

  public onDateClick(day: Date | null): void {
    if (!day || this.disabled) return;
    
    // If touch event just handled this (within last 500ms), ignore the click event to prevent double-firing
    // But only if we actually had a touch event - this allows clicks to work if touch events fail
    if (this.dateCellTouchHandled && this.isDateCellTouching) {
      // Touch event handled it, but clear the flag now
      this.dateCellTouchHandled = false;
      this.isDateCellTouching = false;
      return;
    }
    
    // Reset touch tracking if click is being used (fallback for when touch events don't work)
    this.isDateCellTouching = false;
    this.dateCellTouchStartTime = 0;
    this.dateCellTouchStartDate = null;
    this.lastDateCellTouchDate = null;
    
    if (this.isCurrentMonth(day) && this.isDateDisabled(day)) return;

    const dateToToggle = getStartOfDay(day);
    
    if (this.hooks?.beforeDateSelect) {
      if (!this.hooks.beforeDateSelect(day, this._internalValue)) {
        return;
      }
    }

    if (this.mode === 'single') {
      this.selectedDate = this.applyCurrentTime(day);
      this.emitValue(this.selectedDate);
    } else if (this.mode === 'range') {
      // Improved range selection logic for better mobile support
      const dayTime = getStartOfDay(day).getTime();
      const startTime = this.startDate ? getStartOfDay(this.startDate).getTime() : null;
      
      // If no start date, or both dates are set, start a new range
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = this.applyCurrentTime(day);
        this.endDate = null;
        this.hoveredDate = null;
        // Don't emit value until end date is selected - store start date internally only
        // This prevents form control issues with invalid range values
      } 
      // If start date exists but no end date
      else if (this.startDate && !this.endDate) {
        // If the clicked day is before start date, make it the new start date
        if (dayTime < startTime!) {
          this.startDate = this.applyCurrentTime(day);
          this.endDate = null;
          this.hoveredDate = null;
          // Don't emit value until end date is selected
        }
        // If the clicked day is same as start date, clear selection
        else if (dayTime === startTime!) {
          // Clear selection on same date click (optional - can be removed if not desired)
          // this.startDate = null;
          // this.endDate = null;
          // this.emitValue(null);
        }
        // If the clicked day is after start date, set it as end date
        else {
        const potentialEndDate = this.applyCurrentTime(day);
        
          // Validate range if hook is provided
        if (this.hooks?.validateRange) {
          if (!this.hooks.validateRange(this.startDate, potentialEndDate)) {
              // If validation fails, reset to new start date
            this.startDate = potentialEndDate;
            this.endDate = null;
            this.hoveredDate = null;
              // Don't emit value until end date is selected
              this.cdr.markForCheck();
            return;
          }
        }
        
        this.endDate = potentialEndDate;
          this.hoveredDate = null;
        this.emitValue({start: this.startDate as Date, end: this.endDate as Date});
          
          // Force change detection after range selection
          this.cdr.markForCheck();
        }
      }
      
      // Clear hovered date after selection
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

    if (this.hooks?.afterDateSelect) {
      this.hooks.afterDateSelect(day, this._internalValue);
    }
    
    this.action.emit({
      type: 'dateSelected',
      payload: {
        mode: this.mode,
        value: this._internalValue,
        date: day
      }
    });

    if (this.shouldAutoClose()) {
      this.closeCalendar();
    }
    
    this.cdr.markForCheck();
  }

  public onDateHover(day: Date | null): void {
    if (this.mode === 'range' && this.startDate && !this.endDate && day) {
      this.hoveredDate = day;
      this.cdr.markForCheck();
    }
  }

  public onDateCellTouchStart(event: TouchEvent, day: Date | null): void {
    if (this.disabled || !day || this.isDateDisabled(day)) {
      return;
    }

    // Stop propagation to prevent calendar close, but don't prevent default to allow scrolling when needed
    event.stopPropagation();
    
    // Reset handled flag at start of new touch
    this.dateCellTouchHandled = false;
    this.isDateCellTouching = true;
    
    const touch = event.touches[0];
    if (touch) {
      this.dateCellTouchStartTime = Date.now();
      this.dateCellTouchStartDate = day;
      this.dateCellTouchStartX = touch.clientX;
      this.dateCellTouchStartY = touch.clientY;
      this.lastDateCellTouchDate = day;
      
      // For range mode, update hovered date on touch start for preview
      if (this.mode === 'range' && this.startDate && !this.endDate) {
        const dayTime = getStartOfDay(day).getTime();
        const startTime = getStartOfDay(this.startDate).getTime();
        // Only show preview if day is after start date
        if (dayTime >= startTime) {
          this.hoveredDate = day;
          this.cdr.markForCheck();
        } else {
          // If day is before start date, clear preview
          this.hoveredDate = null;
          this.cdr.markForCheck();
        }
      } else if (this.mode === 'range' && !this.startDate) {
        // Starting a new range - clear any previous hover state
        this.hoveredDate = null;
      }
    } else {
      // No touch data - reset
      this.isDateCellTouching = false;
    }
  }

  public onDateCellTouchMove(event: TouchEvent): void {
    if (this.disabled || !this.isDateCellTouching || !this.dateCellTouchStartDate) {
      return;
    }

    // Only handle for range mode when selecting end date
    if (this.mode === 'range' && this.startDate && !this.endDate) {
      const touch = event.touches[0];
      if (touch) {
        // Check if this is a significant movement (drag for range selection)
        const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
        const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
        const isSignificantMove = deltaX > 5 || deltaY > 5;
        
        // Only prevent default if it's a significant move (indicating range selection drag)
        // This allows normal scrolling for small movements
        if (isSignificantMove) {
          event.preventDefault();
        }
        
        // Use elementFromPoint to find the date cell under the touch point
        try {
          const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elementFromPoint) {
            // Find the date cell element (could be the cell itself or a child like day-number)
            const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
            if (dateCell && !dateCell.classList.contains('empty') && !dateCell.classList.contains('disabled')) {
              // Get the date from the data attribute
              const dateTimestamp = dateCell.getAttribute('data-date');
              if (dateTimestamp) {
                const dateValue = parseInt(dateTimestamp, 10);
                if (!isNaN(dateValue)) {
                  const day = new Date(dateValue);
                  if (day && !isNaN(day.getTime()) && !this.isDateDisabled(day)) {
                    const dayTime = getStartOfDay(day).getTime();
                    const startTime = getStartOfDay(this.startDate).getTime();
                    
                    // Update hovered date for preview - allow dates after start date
                    if (dayTime >= startTime) {
                      this.hoveredDate = day;
                      this.lastDateCellTouchDate = day;
                      // Force change detection for preview update
                      this.cdr.detectChanges();
                    } else {
                      // If dragging before start date, clear preview but don't update last touched date
                      this.hoveredDate = null;
                      this.cdr.detectChanges();
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          // If elementFromPoint fails, ignore and continue
        }
      }
    }
  }

  public onDateCellTouchEnd(event: TouchEvent, day: Date | null): void {
    if (this.disabled) {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }

    // If we didn't have a valid touch start, don't process
    if (!this.isDateCellTouching || !this.dateCellTouchStartDate) {
      this.isDateCellTouching = false;
      return;
    }

    const now = Date.now();
    const touchDuration = this.dateCellTouchStartTime > 0 ? now - this.dateCellTouchStartTime : 0;
    const touch = event.changedTouches[0];
    
    // Get the date from the touch end location - try elementFromPoint first
    let endDay: Date | null = day || this.dateCellTouchStartDate;
    if (touch) {
      try {
        const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementFromPoint) {
          const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
          if (dateCell) {
            const dateTimestamp = dateCell.getAttribute('data-date');
            if (dateTimestamp) {
              const dateValue = parseInt(dateTimestamp, 10);
              if (!isNaN(dateValue)) {
                const parsedDay = new Date(dateValue);
                if (parsedDay && !isNaN(parsedDay.getTime())) {
                  endDay = parsedDay;
                }
              }
            }
          }
        }
      } catch (e) {
        // If elementFromPoint fails, use the day parameter or start date
        endDay = day || this.dateCellTouchStartDate;
      }
    }
    
    // Use the last touched date (from touchmove) or the end day or start day
    const finalDay = this.lastDateCellTouchDate || endDay || this.dateCellTouchStartDate;
    
    if (!finalDay || this.isDateDisabled(finalDay)) {
      // Reset and allow click event to handle it
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }
    
    if (touch) {
      const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
      const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
      // Increased thresholds for better tap detection on mobile
      const isTap = touchDuration < 500 && deltaX < 20 && deltaY < 20;
      
      // If it's a tap (not a drag), treat it as a click
      if (isTap) {
        // Prevent default to avoid double-firing with click event
        event.preventDefault();
        event.stopPropagation();
        
        // Mark as handled to prevent click event from firing
        this.dateCellTouchHandled = true;
        
        // Use the date from touch start (more reliable for taps)
        const dateToSelect = this.dateCellTouchStartDate || finalDay;
        
        // Call onDateClick directly
        this.onDateClick(dateToSelect);
        
        // Reset touch tracking immediately
        this.isDateCellTouching = false;
        this.dateCellTouchStartTime = 0;
        this.dateCellTouchStartDate = null;
        this.lastDateCellTouchDate = null;
        
        // Clear the handled flag after a delay to allow future clicks
        setTimeout(() => {
          this.dateCellTouchHandled = false;
        }, 500);
      } else {
        // It was a drag/swipe - handle based on mode
        event.preventDefault();
        event.stopPropagation();
        
        // Mark as handled to prevent click event from firing
        this.dateCellTouchHandled = true;
        
        if (this.mode === 'range' && this.startDate && !this.endDate) {
          // For range mode, select the end date from the drag
          // Call onDateClick - it will handle whether to set as end date or new start date
          this.onDateClick(finalDay);
        } else {
          // For single/multiple mode or when starting a new range, treat drag as selection
          this.onDateClick(finalDay);
        }
        
        // Reset touch tracking immediately
        this.isDateCellTouching = false;
        this.dateCellTouchStartTime = 0;
        this.dateCellTouchStartDate = null;
        this.lastDateCellTouchDate = null;
        
        // Clear the handled flag after a delay
        setTimeout(() => {
          this.dateCellTouchHandled = false;
        }, 500);
      }
    } else {
      // No touch data - reset tracking and allow click to handle
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }
    
    // Clear hovered date after selection
    if (this.mode === 'range') {
      setTimeout(() => {
        this.hoveredDate = null;
        this.cdr.markForCheck();
      }, 300);
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

    this.cdr.markForCheck();

    this.action.emit({
      type: 'calendarGenerated',
      payload: {
        month: month,
        year: year,
        days: this.daysInMonth.filter(d => d !== null)
      }
    });
    
    // Re-setup touch listeners after calendar regenerates (dates may have changed)
    if (this.isBrowser) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
      });
    }
  }

  private generateDropdownOptions(): void {
    this.yearOptions = generateYearOptions(this._currentYear, this.yearRange);
  }

  public changeMonth(delta: number): void {
    if (this.disabled) return;

    if (delta < 0 && this.isBackArrowDisabled) return;

    const newDate = addMonths(this.currentDate, delta);
    this.currentDate = newDate;
    this._currentMonth = newDate.getMonth();
    this._currentYear = newDate.getFullYear();
    this.generateCalendar();

    this.action.emit({type: 'monthChanged', payload: { delta: delta }});
    this.cdr.markForCheck();
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
    // Clean up passive touch listeners
    this.passiveTouchListeners.forEach(cleanup => cleanup());
    this.passiveTouchListeners = [];
    
    this.selectedDate = null;
    this.selectedDates = [];
    this.startDate = null;
    this.endDate = null;
    this.hoveredDate = null;
    this._internalValue = null;
    
    if (this.openCalendarTimeoutId) {
      clearTimeout(this.openCalendarTimeoutId);
      this.openCalendarTimeoutId = null;
    }
  }
}