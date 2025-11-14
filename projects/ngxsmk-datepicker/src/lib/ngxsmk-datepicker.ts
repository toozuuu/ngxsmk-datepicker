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
  EffectRef,
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
  getEndOfDay,
  addMonths,
  normalizeDate,
  DateInput,
} from './utils/date.utils';
import { formatDateWithTimezone } from './utils/timezone.utils';
import { generateRecurringDates } from './utils/recurring-dates.utils';
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
  generateYearGrid,
  generateDecadeGrid,
} from './utils/calendar.utils';
import { CustomSelectComponent } from './components/custom-select.component';
import { createDateComparator } from './utils/performance.utils';
import { 
  DatepickerHooks, 
  KeyboardShortcutContext
} from './interfaces/datepicker-hooks.interface';
import { DATEPICKER_CONFIG, DatepickerConfig } from './config/datepicker.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SignalFormField = {
  value?: any;
  disabled?: boolean | (() => boolean);
  setValue?: (value: any) => void;
  updateValue?: (updater: () => any) => void;
} | null | undefined | any;

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
    <div class="ngxsmk-datepicker-wrapper" [class.ngxsmk-inline-mode]="isInlineMode" [class.ngxsmk-calendar-open]="isCalendarOpen && !isInlineMode" [class.ngxsmk-rtl]="isRtl" [ngClass]="classes?.wrapper">
      @if (!isInlineMode) {
        <div class="ngxsmk-input-group" (click)="toggleCalendar($event)" (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp($event)" (focus)="onInputGroupFocus()" (keydown.enter)="toggleCalendar($event)" (keydown.space)="toggleCalendar($event); $event.preventDefault()" [class.disabled]="disabled" role="button" [attr.aria-disabled]="disabled" aria-haspopup="dialog" [attr.aria-expanded]="isCalendarOpen" tabindex="0" [ngClass]="classes?.inputGroup">
          <input type="text" 
                 [value]="displayValue" 
                 [placeholder]="placeholder" 
                 readonly 
                 [disabled]="disabled"
                 [attr.aria-label]="placeholder || (timeOnly ? 'Select time' : 'Select date')"
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
        <div class="ngxsmk-popover-container" [class.ngxsmk-inline-container]="isInlineMode" [class.ngxsmk-popover-open]="isCalendarOpen && !isInlineMode" [class.ngxsmk-time-only-popover]="timeOnly" [class.ngxsmk-has-time-selection]="showTime || timeOnly" [ngClass]="classes?.popover">
          <div class="ngxsmk-datepicker-container" [ngClass]="classes?.container">
            @if (showRanges && rangesArray.length > 0 && mode === 'range' && !timeOnly) {
              <div class="ngxsmk-ranges-container">
                <ul>
                  @for (range of rangesArray; track trackByRange($index, range)) {
                    <li (click)="selectRange(range.value)" (keydown.enter)="selectRange(range.value)" (keydown.space)="selectRange(range.value); $event.preventDefault()" [class.disabled]="disabled" [attr.tabindex]="disabled ? -1 : 0" role="button" [attr.aria-disabled]="disabled">{{ range.key }}</li>
                  }
                </ul>
              </div>
            }
            <div class="ngxsmk-calendar-container" [class.ngxsmk-time-only-mode]="timeOnly" [ngClass]="classes?.calendar">
              @if (!timeOnly) {
                @if (calendarViewMode === 'month') {
                <div class="ngxsmk-header" [ngClass]="classes?.header">
                  <div class="ngxsmk-month-year-selects">
                    <ngxsmk-custom-select class="month-select" [options]="monthOptions"
                                      [(value)]="currentMonth" [disabled]="disabled"></ngxsmk-custom-select>
                      <ngxsmk-custom-select class="year-select" [options]="yearOptions" [(value)]="currentYear" [disabled]="disabled" (valueChange)="onYearSelectChange($event)"></ngxsmk-custom-select>
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
                  <div class="ngxsmk-days-grid-wrapper" 
                       (touchstart)="onCalendarSwipeStart($event)"
                       (touchmove)="onCalendarSwipeMove($event)"
                       (touchend)="onCalendarSwipeEnd($event)">
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
                }
                
                @if (calendarViewMode === 'year') {
                  <div class="ngxsmk-header" [ngClass]="classes?.header">
                    <div class="ngxsmk-year-display">
                      <button type="button" class="ngxsmk-view-toggle" (click)="calendarViewMode = 'decade'" [disabled]="disabled">
                        {{ _currentDecade }} - {{ _currentDecade + 9 }}
                      </button>
                    </div>
                    <div class="ngxsmk-nav-buttons">
                      <button type="button" class="ngxsmk-nav-button" (click)="changeYear(-12)" [disabled]="disabled" [attr.aria-label]="'Previous years'" [ngClass]="classes?.navPrev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M328 112L184 256l144 144"/>
                        </svg>
                      </button>
                      <button type="button" class="ngxsmk-nav-button" (click)="changeYear(12)" [disabled]="disabled" [attr.aria-label]="'Next years'" [ngClass]="classes?.navNext">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M184 112l144 144-144 144"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-year-grid">
                    @for (year of yearGrid; track $index) {
                      <button type="button" 
                              class="ngxsmk-year-cell"
                              [class.selected]="year === _currentYear"
                              [class.today]="year === today.getFullYear()"
                              [disabled]="disabled"
                              (click)="onYearClick(year)"
                              (keydown.enter)="onYearClick(year)"
                              [attr.aria-label]="'Select year ' + year">
                        {{ year }}
                      </button>
                    }
                  </div>
                }
                
                @if (calendarViewMode === 'decade') {
                  <div class="ngxsmk-header" [ngClass]="classes?.header">
                    <div class="ngxsmk-decade-display">
                      {{ _currentDecade }} - {{ _currentDecade + 99 }}
                    </div>
                    <div class="ngxsmk-nav-buttons">
                      <button type="button" class="ngxsmk-nav-button" (click)="changeDecade(-1)" [disabled]="disabled" [attr.aria-label]="'Previous decade'" [ngClass]="classes?.navPrev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M328 112L184 256l144 144"/>
                        </svg>
                      </button>
                      <button type="button" class="ngxsmk-nav-button" (click)="changeDecade(1)" [disabled]="disabled" [attr.aria-label]="'Next decade'" [ngClass]="classes?.navNext">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48"
                                d="M184 112l144 144-144 144"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="ngxsmk-decade-grid">
                    @for (decade of decadeGrid; track $index) {
                      <button type="button" 
                              class="ngxsmk-decade-cell"
                              [class.selected]="decade === _currentDecade"
                              [disabled]="disabled"
                              (click)="onDecadeClick(decade)"
                              (keydown.enter)="onDecadeClick(decade)"
                              [attr.aria-label]="'Select decade ' + decade + ' - ' + (decade + 9)">
                        {{ decade }} - {{ decade + 9 }}
                      </button>
                    }
                  </div>
                }
                
                @if (calendarViewMode === 'timeline' && mode === 'range') {
                  <div class="ngxsmk-timeline-view">
                    <div class="ngxsmk-timeline-header">
                      <div class="ngxsmk-timeline-controls">
                        <button type="button" class="ngxsmk-timeline-zoom-out" (click)="timelineZoomOut()" [disabled]="disabled">-</button>
                        <span class="ngxsmk-timeline-range">{{ timelineStartDate | date:'shortDate' }} - {{ timelineEndDate | date:'shortDate' }}</span>
                        <button type="button" class="ngxsmk-timeline-zoom-in" (click)="timelineZoomIn()" [disabled]="disabled">+</button>
                      </div>
                    </div>
                    <div class="ngxsmk-timeline-container" #timelineContainer>
                      <div class="ngxsmk-timeline-track">
                        @for (month of timelineMonths; track month.getTime()) {
                          <div class="ngxsmk-timeline-month" 
                               [class.selected]="isTimelineMonthSelected(month)"
                               (click)="onTimelineMonthClick(month)"
                               (keydown.enter)="onTimelineMonthClick(month)"
                               (keydown.space)="onTimelineMonthClick(month); $event.preventDefault()"
                               role="button"
                               tabindex="0"
                               [attr.aria-label]="month | date:'MMMM yyyy'">
                            <div class="ngxsmk-timeline-month-label">{{ month | date:'MMM' }}</div>
                            <div class="ngxsmk-timeline-month-year">{{ month | date:'yyyy' }}</div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
                
                @if (calendarViewMode === 'time-slider' && mode === 'range' && showTime) {
                  <div class="ngxsmk-time-slider-view">
                    <div class="ngxsmk-time-slider-header">
                      <div class="ngxsmk-time-slider-label">Start Time</div>
                      <div class="ngxsmk-time-slider-value">{{ formatTimeSliderValue(startTimeSlider) }}</div>
                    </div>
                    <div class="ngxsmk-time-slider-container">
                      <input type="range" 
                             class="ngxsmk-time-slider"
                             [min]="0"
                             [max]="1440"
                             [step]="minuteInterval"
                             [(ngModel)]="startTimeSlider"
                             (ngModelChange)="onStartTimeSliderChange($event)"
                             [disabled]="disabled">
                    </div>
                    <div class="ngxsmk-time-slider-header">
                      <div class="ngxsmk-time-slider-label">End Time</div>
                      <div class="ngxsmk-time-slider-value">{{ formatTimeSliderValue(endTimeSlider) }}</div>
                    </div>
                    <div class="ngxsmk-time-slider-container">
                      <input type="range" 
                             class="ngxsmk-time-slider"
                             [min]="0"
                             [max]="1440"
                             [step]="minuteInterval"
                             [(ngModel)]="endTimeSlider"
                             (ngModelChange)="onEndTimeSliderChange($event)"
                             [disabled]="disabled">
                    </div>
                  </div>
                }
              }

              @if (showTime || timeOnly) {
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
  private static _allInstances: NgxsmkDatepickerComponent[] = [];
  public _uniqueId = `ngxsmk-datepicker-${NgxsmkDatepickerComponent._idCounter++}`;
  
  @Input() mode: 'single' | 'range' | 'multiple' = 'single';
  @Input() calendarViewMode: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'month';
  @Input() isInvalidDate: (date: Date) => boolean = () => false;
  @Input() showRanges: boolean = true;
  @Input() showTime: boolean = false;
  @Input() timeOnly: boolean = false;
  @Input() minuteInterval: number = 1;
  @Input() holidayProvider: HolidayProvider | null = null;
  @Input() disableHolidays: boolean = false;
  @Input() disabledDates: (string | Date)[] = [];
  @Input() disabledRanges: Array<{ start: Date | string; end: Date | string }> = [];
  @Input() recurringPattern?: { pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'weekdays' | 'weekends'; startDate: Date; endDate?: Date; dayOfWeek?: number; dayOfMonth?: number; interval?: number } | null;
  private _placeholder: string | null = null;
  @Input() set placeholder(value: string | null) {
    this._placeholder = value;
  }
  get placeholder(): string {
    if (this._placeholder !== null) {
      return this._placeholder;
    }
    return this.timeOnly ? 'Select Time' : 'Select Date';
  }
  @Input() inline: boolean | 'always' | 'auto' = false;
  @Input() clearLabel: string = 'Clear';
  @Input() closeLabel: string = 'Close';
  @Input() prevMonthAriaLabel: string = 'Previous month';
  @Input() nextMonthAriaLabel: string = 'Next month';
  @Input() clearAriaLabel: string = 'Clear selection';
  @Input() closeAriaLabel: string = 'Close calendar';
  @Input() weekStart: number | null = null;
  @Input() yearRange: number = 10;
  @Input() timezone?: string;
  @Input() hooks: DatepickerHooks | null = null;
  @Input() enableKeyboardShortcuts: boolean = true;
  @Input() customShortcuts: { [key: string]: (context: KeyboardShortcutContext) => boolean } | null = null;
  @Input() autoApplyClose: boolean = false;
  @Input() displayFormat?: string;
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
      const normalizedValue = this._normalizeValue(val);
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

  private _field: SignalFormField = null;
  private _isUpdatingFromInternal: boolean = false;
  private _fieldSyncInterval: any = null;
  private _fieldSyncStartTime: number = 0;
  private _lastKnownFieldValue: any = undefined;
  private _fieldEffectRef: EffectRef | null = null;
  
  @Input() set field(field: SignalFormField) {
    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }
    
    this._field = field;
    this._lastKnownFieldValue = undefined;
    
    if (field && typeof field === 'object') {
      const initialSync = this.syncFieldValue(field);
      
      try {
        const effectRef = effect(() => {
            if (this._isUpdatingFromInternal) {
              return;
            }
            
            let fieldValue: any = null;
            
            if (typeof field.value === 'function') {
              try {
                fieldValue = field.value();
              } catch (e) {
                fieldValue = null;
              }
            } else if (field.value !== undefined) {
              fieldValue = field.value;
            }
            
            const normalizedValue = this._normalizeValue(fieldValue);
            
            const valueChanged = !this.isValueEqual(normalizedValue, this._internalValue);
            const isInitialLoad = this._lastKnownFieldValue === undefined && fieldValue !== null && fieldValue !== undefined;
            const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) && 
                                     fieldValue !== null && fieldValue !== undefined;
            
            if (valueChanged || isInitialLoad || isValueTransition) {
              this._internalValue = normalizedValue;
              this._lastKnownFieldValue = fieldValue;
              this.initializeValue(normalizedValue);
              this.generateCalendar();
              this.cdr.markForCheck();
              setTimeout(() => {
                if (this._field === field) {
                  this.cdr.markForCheck();
                }
              }, 0);
              this._stopFieldSyncInterval();
            } else if (this._lastKnownFieldValue !== fieldValue) {
              this._lastKnownFieldValue = fieldValue;
            }
            
            if (typeof field.disabled === 'function') {
              try {
                const newDisabled = field.disabled();
                if (this.disabled !== newDisabled) {
                  this.disabled = newDisabled;
                  this.cdr.markForCheck();
                }
              } catch (e) {
                // Ignore disabled errors
              }
            } else if (field.disabled !== undefined && this.disabled !== field.disabled) {
              this.disabled = field.disabled;
              this.cdr.markForCheck();
            }
        });
        
        this._fieldEffectRef = effectRef;
      } catch (e) {
        this.syncFieldValue(field);
      }
      
      if (!initialSync) {
        this._startFieldSyncInterval();
      }
    } else {
      this._stopFieldSyncInterval();
    }
  }
  get field(): SignalFormField {
    return this._field;
  }
  
  private syncFieldValue(field: SignalFormField): boolean {
    if (!field || typeof field !== 'object') return false;
    
    let fieldValue: any = null;
    try {
      fieldValue = typeof field.value === 'function' ? field.value() : field.value;
    } catch (e) {
      return false;
    }
    
    const normalizedValue = this._normalizeValue(fieldValue);
    
    const hasValueChanged = !this.isValueEqual(normalizedValue, this._internalValue);
    const isInitialLoad = this._lastKnownFieldValue === undefined && fieldValue !== null && fieldValue !== undefined;
    const isValueTransition = (this._lastKnownFieldValue === null || this._lastKnownFieldValue === undefined) && 
                             fieldValue !== null && fieldValue !== undefined;
    
    if (hasValueChanged || isInitialLoad || isValueTransition) {
      this._internalValue = normalizedValue;
      this._lastKnownFieldValue = fieldValue;
      this.initializeValue(normalizedValue);
      this.generateCalendar();
      this.cdr.markForCheck();
      if (this.isBrowser) {
        setTimeout(() => {
          this.cdr.markForCheck();
        }, 0);
      }
      return true;
    }
    
    if (this._lastKnownFieldValue !== fieldValue) {
      this._lastKnownFieldValue = fieldValue;
    }
    
    if (typeof field.disabled === 'function') {
      try {
        this.disabled = field.disabled();
      } catch (e) {
        // Ignore disabled errors
      }
    } else if (field.disabled !== undefined) {
      this.disabled = field.disabled;
    }
    return false;
  }

  private _startFieldSyncInterval(): void {
    this._stopFieldSyncInterval();
    
    if (!this.isBrowser || !this._field) return;
    
    this._fieldSyncStartTime = Date.now();
    const maxDuration = 30000;
    const checkInterval = 100;
    
    this._fieldSyncInterval = setInterval(() => {
      if (!this._field) {
        this._stopFieldSyncInterval();
        return;
      }
      
      const elapsed = Date.now() - this._fieldSyncStartTime;
      
      const valueApplied = this.syncFieldValue(this._field);
      
      if (valueApplied) {
        let fieldValue: any = null;
        try {
          fieldValue = typeof this._field.value === 'function' ? this._field.value() : this._field.value;
        } catch (e) {
          fieldValue = null;
        }
        
        if (fieldValue !== null && fieldValue !== undefined) {
          this._stopFieldSyncInterval();
          return;
        }
      }
      
      if (elapsed > maxDuration) {
        this._stopFieldSyncInterval();
      }
    }, checkInterval);
  }

  private _stopFieldSyncInterval(): void {
    if (this._fieldSyncInterval) {
      clearInterval(this._fieldSyncInterval);
      this._fieldSyncInterval = null;
    }
  }

  private _startAtDate: Date | null = null;
  @Input() set startAt(value: DateInput | null) { this._startAtDate = this._normalizeDate(value); }

  private _locale: string = 'en-US';
  @Input() set locale(value: string) { this._locale = value; }
  get locale(): string { return this._locale; }

  @Input() theme: 'light' | 'dark' = 'light';
  @HostBinding('class.dark-theme') get isDarkMode() { return this.theme === 'dark'; }

  private _rtl: boolean | null = null;
  @Input() set rtl(value: boolean | null) {
    this._rtl = value;
    this.updateRtlState();
  }
  get rtl(): boolean | null {
    return this._rtl;
  }
  get isRtl(): boolean {
    if (this._rtl !== null) {
      return this._rtl;
    }
    if (this.isBrowser && typeof document !== 'undefined') {
      return document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';
    }
    const rtlLocales = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'iw', 'ku', 'ps', 'sd'];
    return rtlLocales.some(locale => this._locale.toLowerCase().startsWith(locale));
  }
  @HostBinding('class.ngxsmk-rtl') get rtlClass() { return this.isRtl; }

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

  private dateCellTouchStartTime: number = 0;
  private dateCellTouchStartDate: Date | null = null;
  private dateCellTouchStartX: number = 0;
  private dateCellTouchStartY: number = 0;
  private isDateCellTouching: boolean = false;
  private lastDateCellTouchDate: Date | null = null;
  private dateCellTouchHandled: boolean = false;

  private calendarSwipeStartX: number = 0;
  private calendarSwipeStartY: number = 0;
  private calendarSwipeStartTime: number = 0;
  private isCalendarSwiping: boolean = false;
  private readonly SWIPE_THRESHOLD = 50;
  private readonly SWIPE_TIME_THRESHOLD = 300;

  private _currentMonth: number = this.currentDate.getMonth();
  public _currentYear: number = this.currentDate.getFullYear();
  public _currentDecade: number = Math.floor(this.currentDate.getFullYear() / 10) * 10;

  public monthOptions: { label: string; value: number }[] = [];
  public yearOptions: { label: string; value: number }[] = [];
  public decadeOptions: { label: string; value: number }[] = [];
  public yearGrid: number[] = [];
  public decadeGrid: number[] = [];
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

  public timelineMonths: Date[] = [];
  public timelineStartDate: Date = new Date();
  public timelineEndDate: Date = new Date();
  private timelineZoomLevel: number = 1;
  public startTimeSlider: number = 0;
  public endTimeSlider: number = 1440;

  private readonly elementRef: ElementRef = inject(ElementRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly globalConfig: DatepickerConfig | null = inject(DATEPICKER_CONFIG, { optional: true });
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly dateComparator = createDateComparator();
  
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
    
    if (this.displayFormat) {
      return this.formatWithCustomFormat();
    }
    
    if (this.timeOnly) {
      if (this.mode === 'single' && this.selectedDate) {
        const options: Intl.DateTimeFormatOptions = { 
          hour: '2-digit',
          minute: '2-digit'
        };
        return formatDateWithTimezone(this.selectedDate, this.locale, options, this.timezone);
      } else if (this.mode === 'range' && this.startDate) {
        if (this.endDate) {
          const startOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const endOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const start = formatDateWithTimezone(this.startDate, this.locale, startOptions, this.timezone);
          const end = formatDateWithTimezone(this.endDate, this.locale, endOptions, this.timezone);
          return `${start} - ${end}`;
        } else {
          const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
          const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
          return `${start}...`;
        }
      } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
        return `${this.selectedDates.length} times selected`;
      }
      return '';
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
      
      return formatDateWithTimezone(this.selectedDate, this.locale, options, this.timezone);
    } else if (this.mode === 'range' && this.startDate) {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      };
      if (this.endDate) {
      const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
      const end = formatDateWithTimezone(this.endDate, this.locale, options, this.timezone);
      return `${start} - ${end}`;
      } else {
        const start = formatDateWithTimezone(this.startDate, this.locale, options, this.timezone);
        return `${start}...`;
      }
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return `${this.selectedDates.length} dates selected`;
    }
    return '';
  }

  private formatWithCustomFormat(): string {
    if (!this.displayFormat) return '';
    
    const adapter = this.globalConfig?.dateAdapter;
    
    if (adapter && typeof adapter.format === 'function') {
      if (this.mode === 'single' && this.selectedDate) {
        return adapter.format(this.selectedDate, this.displayFormat, this.locale);
      } else if (this.mode === 'range' && this.startDate) {
        if (this.endDate) {
          const start = adapter.format(this.startDate, this.displayFormat, this.locale);
          const end = adapter.format(this.endDate, this.displayFormat, this.locale);
          return `${start} - ${end}`;
        } else {
          return adapter.format(this.startDate, this.displayFormat, this.locale) + '...';
        }
      } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
        return `${this.selectedDates.length} dates selected`;
      }
    }
    
    if (this.mode === 'single' && this.selectedDate) {
      return this.formatDateSimple(this.selectedDate, this.displayFormat);
    } else if (this.mode === 'range' && this.startDate) {
      if (this.endDate) {
        const start = this.formatDateSimple(this.startDate, this.displayFormat);
        const end = this.formatDateSimple(this.endDate, this.displayFormat);
        return `${start} - ${end}`;
      } else {
        return this.formatDateSimple(this.startDate, this.displayFormat) + '...';
      }
    } else if (this.mode === 'multiple' && this.selectedDates.length > 0) {
      return `${this.selectedDates.length} dates selected`;
    }
    
    return '';
  }

  private formatDateSimple(date: Date, format: string): string {
    if (!date || isNaN(date.getTime())) return '';
    
    const pad = (n: number, len: number = 2) => n.toString().padStart(len, '0');
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MM/g, pad(month))
      .replace(/M/g, month.toString())
      .replace(/DD/g, pad(day))
      .replace(/D/g, day.toString())
      .replace(/hh/g, pad(hours12))
      .replace(/h/g, hours12.toString())
      .replace(/HH/g, pad(hours))
      .replace(/H/g, hours.toString())
      .replace(/mm/g, pad(minutes))
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, pad(seconds))
      .replace(/s/g, seconds.toString())
      .replace(/a/g, ampm.toLowerCase())
      .replace(/A/g, ampm);
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
    
    const isInsideInputGroup = nativeElement.contains(target);
    
    let isInsidePopover = false;
    if (this.isBrowser && nativeElement) {
      const popoverContainer = (nativeElement as HTMLElement).querySelector('.ngxsmk-popover-container');
      if (popoverContainer && (popoverContainer === target || popoverContainer.contains(target))) {
        isInsidePopover = true;
      }
    }
    
    if (isInsideInputGroup || isInsidePopover) {
      return;
    }
    
    const isInsideOtherDatepicker = NgxsmkDatepickerComponent._allInstances.some(instance => {
      if (instance === this || instance.isInlineMode) {
        return false;
      }
      const otherElement = instance.elementRef.nativeElement;
      if (otherElement && (otherElement === target || otherElement.contains(target))) {
        const otherPopover = (otherElement as HTMLElement).querySelector('.ngxsmk-popover-container');
        if (otherPopover && (otherPopover === target || otherPopover.contains(target))) {
          return true;
        }
      }
      return false;
    });
    
    if (isInsideOtherDatepicker) {
      return;
    }
    
    if (!this.isCalendarOpen) {
      return;
    }
    
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    
    const protectionTime = this.isMobileDevice() ? 1000 : 300;
    
    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      return;
    }
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
    
    const isInsideInputGroup = nativeElement.contains(target);
    
    let isInsidePopover = false;
    if (this.isBrowser && nativeElement) {
      const popoverContainer = (nativeElement as HTMLElement).querySelector('.ngxsmk-popover-container');
      if (popoverContainer && (popoverContainer === target || popoverContainer.contains(target))) {
        isInsidePopover = true;
      }
    }
    
    if (isInsideInputGroup || isInsidePopover) {
      return;
    }
    
    const isInsideOtherDatepicker = NgxsmkDatepickerComponent._allInstances.some(instance => {
      if (instance === this || instance.isInlineMode) {
        return false;
      }
      const otherElement = instance.elementRef.nativeElement;
      if (otherElement && (otherElement === target || otherElement.contains(target))) {
        const otherPopover = (otherElement as HTMLElement).querySelector('.ngxsmk-popover-container');
        if (otherPopover && (otherPopover === target || otherPopover.contains(target))) {
          return true;
        }
      }
      return false;
    });
    
    if (isInsideOtherDatepicker) {
      return;
    }
    
    if (!this.isCalendarOpen) {
      return;
    }
    
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    const protectionTime = this.isMobileDevice() ? 1000 : 300;
    
    if (this.isOpeningCalendar || timeSinceToggle < protectionTime) {
      return;
    }
    
    this.isCalendarOpen = false;
    this.isOpeningCalendar = false;
    this.cdr.markForCheck();
  }

  public onTouchStart(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      return;
    }
    this.touchStartTime = Date.now();
    this.touchStartElement = event.currentTarget;
  }

  public onInputGroupFocus(): void {
    if (this._field && !this.disabled) {
      this.syncFieldValue(this._field);
    }
  }

  public onTouchEnd(event: TouchEvent): void {
    if (this.disabled || this.isInlineMode) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    const now = Date.now();
    const timeSinceTouch = this.touchStartTime > 0 ? now - this.touchStartTime : 0;
    
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
    
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      this.touchStartTime = 0;
      this.touchStartElement = null;
      return;
    }
    
    if (this._field) {
      this.syncFieldValue(this._field);
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    const wasOpen = this.isCalendarOpen;
    
    if (!wasOpen) {
      NgxsmkDatepickerComponent._allInstances.forEach(instance => {
        if (instance !== this && instance.isCalendarOpen && !instance.isInlineMode) {
          instance.isCalendarOpen = false;
          instance.isOpeningCalendar = false;
          instance.updateOpeningState(false);
          instance.cdr.markForCheck();
        }
      });
      
      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
    this.lastToggleTime = now;
      
      setTimeout(() => {
        this.touchStartTime = 0;
        this.touchStartElement = null;
      }, 500);
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }
      
      this.generateCalendar();
      this.updateOpeningState(true);
      
      this.cdr.detectChanges();
      
      if (this.isBrowser) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.cdr.detectChanges();
            const timeoutDelay = this.isMobileDevice() ? 800 : 300;
            if (this.isOpeningCalendar) {
              setTimeout(() => {
                this.isOpeningCalendar = false;
                this.cdr.markForCheck();
              }, timeoutDelay);
            }
          });
        });
      }
    } else {
      this.isCalendarOpen = false;
      this.isOpeningCalendar = false;
      this.lastToggleTime = now;
      
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
      this.isOpeningCalendar = true;
      this.isCalendarOpen = true;
    this.lastToggleTime = now;
      
      if (this.openCalendarTimeoutId) {
        clearTimeout(this.openCalendarTimeoutId);
      }
      
      this.updateOpeningState(true);
      
      this.cdr.detectChanges();
      
      if (this.isBrowser) {
        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
        
        const timeoutDelay = this.isMobileDevice() ? 800 : 350;
        this.openCalendarTimeoutId = setTimeout(() => {
          this.isOpeningCalendar = false;
          this.openCalendarTimeoutId = null;
          this.cdr.markForCheck();
        }, timeoutDelay);
      }
    } else {
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
        this.navigateDate(this.isRtl ? 1 : -1, 0);
        return true;
      case 'ArrowRight':
        this.navigateDate(this.isRtl ? -1 : 1, 0);
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
    const normalizedVal = val !== null && val !== undefined
      ? (this._normalizeDate(val as any) as DatepickerValue)
      : null;
    
    this._internalValue = normalizedVal;
    
    if (this._field) {
      this._isUpdatingFromInternal = true;
      try {
        if (typeof this._field.setValue === 'function') {
          this._field.setValue(normalizedVal as any);
        } else if (typeof this._field.updateValue === 'function') {
          this._field.updateValue(() => normalizedVal);
        } else if (typeof this._field.value === 'function') {
          if (typeof this._field.value.set === 'function') {
            this._field.value.set(normalizedVal);
          } else {
            try {
              const valueSignal = this._field.value();
              if (valueSignal && typeof valueSignal.set === 'function') {
                valueSignal.set(normalizedVal);
              }
            } catch {
            }
          }
        } else if (this._field.value && typeof this._field.value.set === 'function') {
          this._field.value.set(normalizedVal);
        }
        
        Promise.resolve().then(() => {
          setTimeout(() => {
            this._isUpdatingFromInternal = false;
          }, 50);
        });
      } catch {
        setTimeout(() => {
          this._isUpdatingFromInternal = false;
        }, 50);
      }
    }
    
    this.valueChange.emit(normalizedVal);
    this.onChange(normalizedVal);
    this.onTouched();
    
    if (!this.isInlineMode && val !== null && !this.timeOnly) {
      if (this.mode === 'single' || (this.mode === 'range' && this.startDate && this.endDate)) {
        this.isCalendarOpen = false;
      }
    }
  }
  
  public toggleCalendar(event?: Event): void {
    if (this.disabled || this.isInlineMode) return;
    
    const now = Date.now();
    const timeSinceToggle = this.lastToggleTime > 0 ? now - this.lastToggleTime : Infinity;
    if (timeSinceToggle < 300) {
      return;
    }
    
    if (!event) {
      const wasOpen = this.isCalendarOpen;
      const willOpen = !wasOpen;
      this.isCalendarOpen = !wasOpen;
      this.lastToggleTime = now;
      if (willOpen) {
        this.generateCalendar();
      }
      this.updateOpeningState(willOpen && this.isCalendarOpen);
      this.cdr.detectChanges();
      return;
    }
    
    if (event.type === 'touchstart') {
      return;
    }
    
    if (event.type === 'click') {
      const now = Date.now();
      
      const touchDetectionWindow = this.isMobileDevice() ? 600 : 300;
      if (this.touchStartElement && this.touchStartTime > 0) {
        const timeSinceTouch = now - this.touchStartTime;
        if (timeSinceTouch < touchDetectionWindow && (this.touchStartElement === event.target || 
            (event.target as Node) && this.touchStartElement && 
            (this.touchStartElement as Node).contains && 
            (this.touchStartElement as Node).contains(event.target as Node))) {
          if (this.isOpeningCalendar || (timeSinceTouch < 500 && this.isCalendarOpen)) {
            return;
          }
        }
      }
      if (now - this.lastToggleTime < 300) {
        return;
      }
      
      this.lastToggleTime = now;
    }
    
    event.stopPropagation();
    
    const wasOpen = this.isCalendarOpen;
    const willOpen = !wasOpen;
    
    if (willOpen) {
      NgxsmkDatepickerComponent._allInstances.forEach(instance => {
        if (instance !== this && instance.isCalendarOpen && !instance.isInlineMode) {
          instance.isCalendarOpen = false;
          instance.isOpeningCalendar = false;
          instance.updateOpeningState(false);
          instance.cdr.markForCheck();
        }
      });
      
      if (this._field) {
        this.syncFieldValue(this._field);
      }
      
      this.generateCalendar();
    }
    
    this.isCalendarOpen = !wasOpen;
    this.updateOpeningState(willOpen && this.isCalendarOpen);
    
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
      
      const timeoutDelay = this.isMobileDevice() ? 800 : 200;
      this.openCalendarTimeoutId = setTimeout(() => {
        this.isOpeningCalendar = false;
        this.openCalendarTimeoutId = null;
        this.cdr.markForCheck();
      }, timeoutDelay);
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
    if (!this.autoApplyClose || this.showTime || this.timeOnly || this.isInlineMode) {
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
    NgxsmkDatepickerComponent._allInstances.push(this);
    
    this.applyGlobalConfig();
    
    if (this._locale === 'en-US' && this.isBrowser && typeof navigator !== 'undefined' && navigator.language) {
      this._locale = navigator.language;
    }

    if (this.timeOnly) {
      this.showTime = true;
    }

    this.updateRtlState();
    this.today.setHours(0, 0, 0, 0);
    this.generateLocaleData();
    this.generateTimeOptions();
    this.generateYearGrid();
    this.generateDecadeGrid();
    if (this.calendarViewMode === 'timeline') {
      this.generateTimeline();
    }
    if (this.calendarViewMode === 'time-slider' && this.mode === 'range' && this.showTime) {
      this.initializeTimeSliders();
    }

    if ((this.showTime || this.timeOnly) && !this._internalValue) {
      const now = new Date();
      this.currentHour = now.getHours();
      this.currentMinute = Math.floor(now.getMinutes() / this.minuteInterval) * this.minuteInterval;

      if (this.currentMinute === 60) {
        this.currentMinute = 0;
        this.currentHour = (this.currentHour + 1) % 24;
      }
      this.update12HourState(this.currentHour);
      
      if (this.timeOnly && !this._internalValue) {
        const today = new Date();
        today.setHours(this.currentHour, this.currentMinute, 0, 0);
        this.selectedDate = today;
        this.currentDate = new Date(today);
        this._currentMonth = today.getMonth();
        this._currentYear = today.getFullYear();
      }
    }

    let initialValue: DatepickerValue = null;
    if (this._field) {
      try {
        const fieldValue = typeof this._field.value === 'function' ? this._field.value() : this._field.value;
        initialValue = this._normalizeValue(fieldValue);
      } catch (e) {
        initialValue = null;
      }
    } else if (this._value !== null) {
      initialValue = this._value;
    } else if (this._internalValue !== null) {
      initialValue = this._internalValue;
    }
    
    if (initialValue) {
      this.initializeValue(initialValue);
      this._internalValue = initialValue;
      this.cdr.markForCheck();
    } else {
      this.initializeValue(null);
    }
    this.generateCalendar();
    
    if (this._field && this.isBrowser) {
      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 50);
      
      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 200);
      
      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 500);
      
      setTimeout(() => {
        if (this._field) {
          this.syncFieldValue(this._field);
        }
      }, 1000);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setupPassiveTouchListeners();
          this.setupInputGroupPassiveListeners();
          
          setTimeout(() => {
            this.setupInputGroupPassiveListeners();
          }, 100);
        });
      });
      
      if (this._field) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.syncFieldValue(this._field);
          });
        });
        
        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 100);
        
        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 300);
        
        setTimeout(() => {
          if (this._field) {
            this.syncFieldValue(this._field);
          }
        }, 700);
      }
    }
  }

  private setupInputGroupPassiveListeners(): void {
    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) {
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    const inputGroup = nativeElement.querySelector('.ngxsmk-input-group') as HTMLElement;
    if (!inputGroup) {
      setTimeout(() => this.setupInputGroupPassiveListeners(), 50);
      return;
    }

    if ((inputGroup as any).__ngxsmk_touch_listeners_setup) {
      return;
    }
    (inputGroup as any).__ngxsmk_touch_listeners_setup = true;

    const touchStartHandler = (event: TouchEvent) => {
      this.onTouchStart(event);
    };
    inputGroup.addEventListener('touchstart', touchStartHandler, { passive: true });

    const touchEndHandler = (event: TouchEvent) => {
      this.onTouchEnd(event);
    };
    inputGroup.addEventListener('touchend', touchEndHandler, { passive: false });
    this.passiveTouchListeners.push(() => {
      (inputGroup as any).__ngxsmk_touch_listeners_setup = false;
      inputGroup.removeEventListener('touchstart', touchStartHandler);
      inputGroup.removeEventListener('touchend', touchEndHandler);
    });
  }

  private setupPassiveTouchListeners(): void {
    this.passiveTouchListeners.forEach(cleanup => cleanup());
    this.passiveTouchListeners = [];

    const nativeElement = this.elementRef.nativeElement;
    if (!nativeElement) return;

    const dateCells = nativeElement.querySelectorAll('.ngxsmk-day-cell[data-date]');
    
    dateCells.forEach((cell: HTMLElement) => {
      const dateTimestamp = cell.getAttribute('data-date');
      if (!dateTimestamp) return;
      
      const dateValue = parseInt(dateTimestamp, 10);
      if (isNaN(dateValue)) return;
      
      const day = new Date(dateValue);
      if (!day || isNaN(day.getTime())) return;

      const touchStartHandler = (event: TouchEvent) => {
        this.onDateCellTouchStart(event, day);
      };
      cell.addEventListener('touchstart', touchStartHandler, { passive: true });

      const touchEndHandler = (event: TouchEvent) => {
        this.onDateCellTouchEnd(event, day);
      };
      cell.addEventListener('touchend', touchEndHandler, { passive: false });

      const touchMoveHandler = (event: TouchEvent) => {
        this.onDateCellTouchMove(event);
      };
      cell.addEventListener('touchmove', touchMoveHandler, { passive: false });

      this.passiveTouchListeners.push(() => {
        cell.removeEventListener('touchstart', touchStartHandler);
        cell.removeEventListener('touchend', touchEndHandler);
        cell.removeEventListener('touchmove', touchMoveHandler);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeOnly']) {
      if (this.timeOnly) {
        this.showTime = true;
        this.generateTimeOptions();
      }
      this.cdr.markForCheck();
    }
    
    if (changes['locale'] || changes['rtl']) {
      this.updateRtlState();
      if (changes['locale']) {
        this.generateLocaleData();
        this.generateCalendar();
      }
      this.cdr.markForCheck();
    }

    if (changes['weekStart'] || changes['minuteInterval'] || changes['holidayProvider'] || changes['yearRange'] || changes['timezone']) {
      this.applyGlobalConfig();
      if (changes['weekStart'] || changes['yearRange']) {
        this.generateLocaleData();
        this.generateCalendar();
      }
      if (changes['minuteInterval']) {
        this.generateTimeOptions();
      }
      if (changes['timezone']) {
        this.cdr.markForCheck();
      }
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
      if (newField && typeof newField === 'object') {
        this._lastKnownFieldValue = undefined;
        this.syncFieldValue(newField);
        
        if (this.isBrowser) {
          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 50);
          
          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 150);
          
          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 300);
          
          setTimeout(() => {
            if (this._field === newField) {
              this.syncFieldValue(newField);
            }
          }, 600);
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
    
    if (changes['holidayProvider'] || changes['disableHolidays'] || changes['disabledDates'] || changes['disabledRanges']) {
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

    if (changes['calendarViewMode']) {
      if (this.calendarViewMode === 'year') {
        this.generateYearGrid();
      } else if (this.calendarViewMode === 'decade') {
        this.generateDecadeGrid();
      } else if (this.calendarViewMode === 'timeline') {
        this.generateTimeline();
      } else if (this.calendarViewMode === 'time-slider') {
        this.initializeTimeSliders();
      } else {
        this.generateCalendar();
      }
      this.cdr.markForCheck();
    }
  }

  private initializeTimeSliders(): void {
    if (this.mode === 'range' && this.showTime) {
      if (this.startDate) {
        this.startTimeSlider = this.startDate.getHours() * 60 + this.startDate.getMinutes();
      }
      if (this.endDate) {
        this.endTimeSlider = this.endDate.getHours() * 60 + this.endDate.getMinutes();
      } else {
        this.endTimeSlider = 1440;
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
    const newDate = new Date(date);
    newDate.setHours(this.currentHour, this.currentMinute, 0, 0);
    return newDate;
  }

  private applyTimeIfNeeded(date: Date): Date {
    if (this.showTime || this.timeOnly) {
      return this.applyCurrentTime(date);
    }
    return getStartOfDay(date);
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

  private _normalizeValue(val: any): DatepickerValue {
    if (val === null || val === undefined) {
      return null;
    }
    
    if (val instanceof Date) {
      return this._normalizeDate(val) as DatepickerValue;
    } else if (typeof val === 'object' && 'start' in val && 'end' in val) {
      const start = this._normalizeDate(val.start);
      const end = this._normalizeDate(val.end);
      if (start && end) {
        return { start, end } as DatepickerValue;
      }
      return null;
    } else if (Array.isArray(val)) {
      return val.map(d => this._normalizeDate(d)).filter((d): d is Date => d !== null) as DatepickerValue;
    } else {
      const normalized = this._normalizeDate(val);
      return normalized as DatepickerValue;
    }
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

    if (this.disabledRanges.length > 0) {
      for (const range of this.disabledRanges) {
        let startDate: Date | null;
        let endDate: Date | null;
        
        if (typeof range.start === 'string') {
          startDate = this.parseDateString(range.start);
        } else {
          startDate = getStartOfDay(range.start);
        }
        
        if (typeof range.end === 'string') {
          endDate = this.parseDateString(range.end);
        } else {
          endDate = getStartOfDay(range.end);
        }
        
        if (startDate && endDate) {
          const startTime = getStartOfDay(startDate).getTime();
          const endTime = getEndOfDay(endDate).getTime();
          const dateTime = dateOnly.getTime();
          
          if (dateTime >= startTime && dateTime <= endTime) {
            return true;
          }
        }
      }
    }

    if (this.holidayProvider && this.disableHolidays && this.holidayProvider.isHoliday(dateOnly)) {
      return true;
    }

    const effectiveMinDate = this._minDate || (this.globalConfig?.minDate ? this._normalizeDate(this.globalConfig.minDate) : null);
    const effectiveMaxDate = this._maxDate || (this.globalConfig?.maxDate ? this._normalizeDate(this.globalConfig.maxDate) : null);

    if (effectiveMinDate) {
      const minDateOnly = getStartOfDay(effectiveMinDate);
      if (dateOnly.getTime() < minDateOnly.getTime()) return true;
    }
    if (effectiveMaxDate) {
      const maxDateOnly = getStartOfDay(effectiveMaxDate);
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
    
    if (this.timeOnly && this.mode === 'single' && !this.selectedDate) {
      const today = new Date();
      const dateWithTime = this.applyCurrentTime(today);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);
      this.action.emit({type: 'timeChanged', payload: {hour: this.currentHour, minute: this.currentMinute}});
      this.cdr.markForCheck();
      return;
    }
    
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
    
    if (this.dateCellTouchHandled && this.isDateCellTouching) {
      this.dateCellTouchHandled = false;
      this.isDateCellTouching = false;
      return;
    }
    
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
      const dateWithTime = this.applyTimeIfNeeded(day);
      this.selectedDate = dateWithTime;
      this.emitValue(dateWithTime);
    } else if (this.mode === 'range') {
      const dayTime = getStartOfDay(day).getTime();
      const startTime = this.startDate ? getStartOfDay(this.startDate).getTime() : null;
      
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = this.applyTimeIfNeeded(day);
        this.endDate = null;
        this.hoveredDate = null;
      } 
      else if (this.startDate && !this.endDate) {
        if (dayTime < startTime!) {
          this.startDate = this.applyTimeIfNeeded(day);
          this.endDate = null;
          this.hoveredDate = null;
        }
        else if (dayTime === startTime!) {
        }
        else {
        const potentialEndDate = this.applyTimeIfNeeded(day);
        
        if (this.hooks?.validateRange) {
          if (!this.hooks.validateRange(this.startDate, potentialEndDate)) {
            this.startDate = potentialEndDate;
            this.endDate = null;
            this.hoveredDate = null;
              this.cdr.markForCheck();
            return;
          }
        }
        
        this.endDate = potentialEndDate;
          this.hoveredDate = null;
        this.emitValue({start: this.startDate as Date, end: this.endDate as Date});
          
          this.cdr.markForCheck();
        }
      }
      
      this.hoveredDate = null;
    } else if (this.mode === 'multiple') {
      if (this.recurringPattern) {
        const config: any = {
          pattern: this.recurringPattern.pattern,
          startDate: this.recurringPattern.startDate,
          dayOfWeek: this.recurringPattern.dayOfWeek,
          dayOfMonth: this.recurringPattern.dayOfMonth,
          interval: this.recurringPattern.interval || 1
        };
        if (this.recurringPattern.endDate !== undefined) {
          config.endDate = this.recurringPattern.endDate;
        }
        const recurringDates = generateRecurringDates(config);
        
        const datesWithTime = recurringDates.map(d => this.applyTimeIfNeeded(d));
        const uniqueDates = new Map<number, Date>();
        datesWithTime.forEach(d => {
          uniqueDates.set(getStartOfDay(d).getTime(), d);
        });
        this.selectedDates = Array.from(uniqueDates.values()).sort((a, b) => a.getTime() - b.getTime());
        this.emitValue([...this.selectedDates]);
      } else {
      const existingIndex = this.selectedDates.findIndex(d => this.isSameDay(d, dateToToggle));

      if (existingIndex > -1) {
        this.selectedDates.splice(existingIndex, 1);
      } else {
        const dateWithTime = this.applyTimeIfNeeded(dateToToggle);
        this.selectedDates.push(dateWithTime);
        this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
      }
      this.emitValue([...this.selectedDates]);
      }
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

    event.stopPropagation();
    
    this.dateCellTouchHandled = false;
    this.isDateCellTouching = true;
    
    const touch = event.touches[0];
    if (touch) {
      this.dateCellTouchStartTime = Date.now();
      this.dateCellTouchStartDate = day;
      this.dateCellTouchStartX = touch.clientX;
      this.dateCellTouchStartY = touch.clientY;
      this.lastDateCellTouchDate = day;
      
      if (this.mode === 'range' && this.startDate && !this.endDate) {
        const dayTime = getStartOfDay(day).getTime();
        const startTime = getStartOfDay(this.startDate).getTime();
        if (dayTime >= startTime) {
          this.hoveredDate = day;
          this.cdr.markForCheck();
        } else {
          this.hoveredDate = null;
          this.cdr.markForCheck();
        }
      } else if (this.mode === 'range' && !this.startDate) {
        this.hoveredDate = null;
      }
    } else {
      this.isDateCellTouching = false;
    }
  }

  public onDateCellTouchMove(event: TouchEvent): void {
    if (this.disabled || !this.isDateCellTouching || !this.dateCellTouchStartDate) {
      return;
    }

    if (this.mode === 'range' && this.startDate && !this.endDate) {
      const touch = event.touches[0];
      if (touch) {
        const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
        const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
        const isSignificantMove = deltaX > 5 || deltaY > 5;
        
        if (isSignificantMove) {
          event.preventDefault();
        }
        
        try {
          const elementFromPoint = document.elementFromPoint(touch.clientX, touch.clientY);
          if (elementFromPoint) {
            const dateCell = elementFromPoint.closest('.ngxsmk-day-cell') as HTMLElement;
            if (dateCell && !dateCell.classList.contains('empty') && !dateCell.classList.contains('disabled')) {
              const dateTimestamp = dateCell.getAttribute('data-date');
              if (dateTimestamp) {
                const dateValue = parseInt(dateTimestamp, 10);
                if (!isNaN(dateValue)) {
                  const day = new Date(dateValue);
                  if (day && !isNaN(day.getTime()) && !this.isDateDisabled(day)) {
                    const dayTime = getStartOfDay(day).getTime();
                    const startTime = getStartOfDay(this.startDate).getTime();
                    
                    if (dayTime >= startTime) {
                      this.hoveredDate = day;
                      this.lastDateCellTouchDate = day;
                      this.cdr.detectChanges();
                    } else {
                      this.hoveredDate = null;
                      this.cdr.detectChanges();
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
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

    if (!this.isDateCellTouching || !this.dateCellTouchStartDate) {
      this.isDateCellTouching = false;
      return;
    }

    const now = Date.now();
    const touchDuration = this.dateCellTouchStartTime > 0 ? now - this.dateCellTouchStartTime : 0;
    const touch = event.changedTouches[0];
    
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
        endDay = day || this.dateCellTouchStartDate;
      }
    }
    
    const finalDay = this.lastDateCellTouchDate || endDay || this.dateCellTouchStartDate;
    
    if (!finalDay || this.isDateDisabled(finalDay)) {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }
    
    if (touch) {
      const deltaX = Math.abs(touch.clientX - this.dateCellTouchStartX);
      const deltaY = Math.abs(touch.clientY - this.dateCellTouchStartY);
      const isTap = touchDuration < 500 && deltaX < 20 && deltaY < 20;
      
      if (isTap) {
        event.preventDefault();
        event.stopPropagation();
        
        this.dateCellTouchHandled = true;
        
        const dateToSelect = this.dateCellTouchStartDate || finalDay;
        
        this.onDateClick(dateToSelect);
        
        this.isDateCellTouching = false;
        this.dateCellTouchStartTime = 0;
        this.dateCellTouchStartDate = null;
        this.lastDateCellTouchDate = null;
        
        setTimeout(() => {
          this.dateCellTouchHandled = false;
        }, 500);
      } else {
        event.preventDefault();
        event.stopPropagation();
        
        this.dateCellTouchHandled = true;
        
        this.onDateClick(finalDay);
        
        this.isDateCellTouching = false;
        this.dateCellTouchStartTime = 0;
        this.dateCellTouchStartDate = null;
        this.lastDateCellTouchDate = null;
        
        setTimeout(() => {
          this.dateCellTouchHandled = false;
        }, 500);
      }
    } else {
      this.isDateCellTouching = false;
      this.dateCellTouchStartTime = 0;
      this.dateCellTouchStartDate = null;
      this.lastDateCellTouchDate = null;
      return;
    }
    
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
    
    if (this.isBrowser) {
      requestAnimationFrame(() => {
        this.setupPassiveTouchListeners();
      });
    }
  }

  private generateDropdownOptions(): void {
    this.yearOptions = generateYearOptions(this._currentYear, this.yearRange);
  }

  private generateYearGrid(): void {
    this.yearGrid = generateYearGrid(this._currentYear);
  }

  private generateDecadeGrid(): void {
    this.decadeGrid = generateDecadeGrid(this._currentDecade);
  }

  public onYearClick(year: number): void {
    if (this.disabled) return;
    this._currentYear = year;
    this.currentDate.setFullYear(year);
    if (this.calendarViewMode === 'year') {
      this.calendarViewMode = 'month';
    }
    this.generateYearGrid();
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  public onDecadeClick(decade: number): void {
    if (this.disabled) return;
    this._currentDecade = decade;
    this._currentYear = decade;
    this.currentDate.setFullYear(decade);
    if (this.calendarViewMode === 'decade') {
      this.calendarViewMode = 'year';
    }
    this.generateDecadeGrid();
    this.generateYearGrid();
    this.cdr.markForCheck();
  }

  public changeDecade(delta: number): void {
    if (this.disabled) return;
    this._currentDecade += delta * 10;
    this.generateDecadeGrid();
    this.cdr.markForCheck();
  }

  public changeYear(delta: number): void {
    if (this.disabled) return;
    this._currentYear += delta;
    this.currentDate.setFullYear(this._currentYear);
    this.generateYearGrid();
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  public onYearSelectChange(year: number): void {
    this._currentYear = year;
    this.currentDate.setFullYear(year);
    this.generateYearGrid();
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  private generateTimeline(): void {
    if (this.mode !== 'range') return;
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 6 * this.timelineZoomLevel);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 6 * this.timelineZoomLevel);
    
    this.timelineStartDate = startDate;
    this.timelineEndDate = endDate;
    
    this.timelineMonths = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      this.timelineMonths.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    
    this.cdr.markForCheck();
  }

  public timelineZoomIn(): void {
    if (this.timelineZoomLevel < 5) {
      this.timelineZoomLevel++;
      this.generateTimeline();
    }
  }

  public timelineZoomOut(): void {
    if (this.timelineZoomLevel > 1) {
      this.timelineZoomLevel--;
      this.generateTimeline();
    }
  }

  public isTimelineMonthSelected(month: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const rangeStart = getStartOfDay(this.startDate);
    const rangeEnd = getStartOfDay(this.endDate);
    return (monthStart >= rangeStart && monthStart <= rangeEnd) || 
           (monthEnd >= rangeStart && monthEnd <= rangeEnd) ||
           (monthStart <= rangeStart && monthEnd >= rangeEnd);
  }

  public onTimelineMonthClick(month: Date): void {
    if (this.disabled) return;
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    if (!this.startDate) {
      this.startDate = monthStart;
    } else if (!this.endDate) {
      if (monthStart < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = monthStart;
      } else {
        this.endDate = monthEnd;
      }
      this.emitValue({start: this.startDate, end: this.endDate});
    } else {
      this.startDate = monthStart;
      this.endDate = monthEnd;
      this.emitValue({start: this.startDate, end: this.endDate});
    }
    this.cdr.markForCheck();
  }

  public formatTimeSliderValue(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  }

  public onStartTimeSliderChange(minutes: number): void {
    if (this.disabled) return;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (this.startDate) {
      this.startDate.setHours(hours, mins, 0, 0);
      if (this.endDate && this.startDate > this.endDate) {
        this.endDate.setHours(hours, mins, 0, 0);
      }
      this.emitValue(this.startDate && this.endDate ? {start: this.startDate, end: this.endDate} : null);
    }
    this.cdr.markForCheck();
  }

  public onEndTimeSliderChange(minutes: number): void {
    if (this.disabled) return;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (this.endDate) {
      this.endDate.setHours(hours, mins, 0, 0);
      if (this.startDate && this.endDate < this.startDate) {
        this.startDate.setHours(hours, mins, 0, 0);
      }
      this.emitValue(this.startDate && this.endDate ? {start: this.startDate, end: this.endDate} : null);
    }
    this.cdr.markForCheck();
  }

  public onCalendarSwipeStart(event: TouchEvent): void {
    if (this.disabled || !event.touches[0]) return;
    const touch = event.touches[0];
    this.calendarSwipeStartX = touch.clientX;
    this.calendarSwipeStartY = touch.clientY;
    this.calendarSwipeStartTime = Date.now();
    this.isCalendarSwiping = false;
  }

  public onCalendarSwipeMove(event: TouchEvent): void {
    if (this.disabled || !this.calendarSwipeStartTime || !event.touches[0]) return;
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - this.calendarSwipeStartX);
    const deltaY = Math.abs(touch.clientY - this.calendarSwipeStartY);
    
    if (deltaX > deltaY && deltaX > 10) {
      this.isCalendarSwiping = true;
      event.preventDefault();
    }
  }

  public onCalendarSwipeEnd(event: TouchEvent): void {
    if (this.disabled || !this.calendarSwipeStartTime) {
      this.resetSwipeState();
      return;
    }

    const touch = event.changedTouches[0];
    if (!touch) {
      this.resetSwipeState();
      return;
    }

    const deltaX = touch.clientX - this.calendarSwipeStartX;
    const deltaY = Math.abs(touch.clientY - this.calendarSwipeStartY);
    const deltaTime = Date.now() - this.calendarSwipeStartTime;
    const absDeltaX = Math.abs(deltaX);

    if (this.isCalendarSwiping && 
        absDeltaX > this.SWIPE_THRESHOLD && 
        absDeltaX > deltaY && 
        deltaTime < this.SWIPE_TIME_THRESHOLD) {
      
      if (deltaX < 0) {
        if (!this.isBackArrowDisabled) {
          this.changeMonth(1);
        }
      } else {
        this.changeMonth(-1);
      }
    }

    this.resetSwipeState();
  }

  private resetSwipeState(): void {
    this.calendarSwipeStartX = 0;
    this.calendarSwipeStartY = 0;
    this.calendarSwipeStartTime = 0;
    this.isCalendarSwiping = false;
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

  private applyGlobalConfig(): void {
    if (!this.globalConfig) return;

    if (this.weekStart === null && this.globalConfig.weekStart !== undefined) {
      this.weekStart = this.globalConfig.weekStart;
    }

    if (this.minuteInterval === 1 && this.globalConfig.minuteInterval !== undefined) {
      this.minuteInterval = this.globalConfig.minuteInterval;
    }

    if (this.holidayProvider === null && this.globalConfig.holidayProvider !== undefined) {
      this.holidayProvider = this.globalConfig.holidayProvider;
    }

    if (this.yearRange === 10 && this.globalConfig.yearRange !== undefined) {
      this.yearRange = this.globalConfig.yearRange;
    }

    if (this._locale === 'en-US' && this.globalConfig.locale) {
      this._locale = this.globalConfig.locale;
    }

    if (!this.timezone && this.globalConfig.timezone) {
      this.timezone = this.globalConfig.timezone;
    }

    if (!this._minDate && this.globalConfig.minDate !== undefined) {
      this._minDate = this._normalizeDate(this.globalConfig.minDate);
    }

    if (!this._maxDate && this.globalConfig.maxDate !== undefined) {
      this._maxDate = this._normalizeDate(this.globalConfig.maxDate);
    }
  }

  private updateRtlState(): void {
    if (this.isBrowser) {
      const wrapper = this.elementRef.nativeElement.querySelector('.ngxsmk-datepicker-wrapper');
      if (wrapper) {
        if (this.isRtl) {
          wrapper.setAttribute('dir', 'rtl');
        } else {
          wrapper.removeAttribute('dir');
        }
      }
    }
  }

  ngOnDestroy(): void {
    const index = NgxsmkDatepickerComponent._allInstances.indexOf(this);
    if (index > -1) {
      NgxsmkDatepickerComponent._allInstances.splice(index, 1);
    }
    
    if (this._fieldEffectRef) {
      this._fieldEffectRef.destroy();
      this._fieldEffectRef = null;
    }
    
    this._stopFieldSyncInterval();
    
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