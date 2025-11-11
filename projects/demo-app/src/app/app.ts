import {Component, HostBinding, OnInit, OnDestroy, HostListener, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {
  DateRange,
  NgxsmkDatepickerComponent,
  HolidayProvider,
  DatepickerValue,
} from "ngxsmk-datepicker";
import {CodePipe} from './code.pipe';

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

class SampleHolidayProvider implements HolidayProvider {
  private readonly holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-20': 'MLK Jr. Day',
    '2025-02-17': 'Presidents\' Day',
    '2025-05-26': 'Memorial Day',
    '2025-07-04': 'Independence Day',
    '2025-09-01': 'Labor Day',
    '2025-10-13': 'Columbus Day',
    '2025-11-11': 'Veterans Day',
    '2025-11-27': 'Thanksgiving',
    '2025-12-25': 'Christmas Day',
  };

  private formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isHoliday(date: Date): boolean {
    const key = this.formatDateKey(date);
    return !!this.holidays[key];
  }

  getHolidayLabel(date: Date): string | null {
    const key = this.formatDateKey(date);
    return this.holidays[key] || null;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent, ReactiveFormsModule, FormsModule, CodePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit, OnDestroy {
  private readonly today = new Date();
  public readonly JSON = JSON;
  public currentTheme: 'light' | 'dark' = 'light';
  public mobileMenuOpen: boolean = false;
  public selectedMobileSize: number = 375;
  public currentTime: string = '9:41';
  public searchQuery: string = '';
  public filteredNavigationItems: Array<{ id: string; label: string; sub: boolean; keywords: string }> = [];

  public features = [
    { icon: '🚀', title: 'Zero Dependencies', description: 'No external dependencies, just Angular' },
    { icon: '⚡', title: 'High Performance', description: 'GPU-accelerated animations with transform3d, optimized rendering' },
    { icon: '🎨', title: 'Fully Customizable', description: '28+ CSS variables, built-in themes, and extension points' },
    { icon: '📱', title: 'Responsive', description: 'Mobile-first design, works great on all device sizes' },
    { icon: '🔧', title: 'Type Safe', description: 'Full TypeScript support with comprehensive type definitions' },
    { icon: '♿', title: 'Accessible', description: 'ARIA attributes, keyboard navigation, screen reader support' },
    { icon: '📦', title: 'Lightweight', description: 'Small bundle size, minimal overhead, tree-shakeable' },
    { icon: '🔄', title: 'Form Integration', description: 'Reactive Forms, Signal Forms (Angular 21+), ControlValueAccessor' },
    { icon: '🎯', title: 'Extension Points', description: 'Comprehensive hooks for customization, validation, and events' },
    { icon: '⌨️', title: 'Keyboard Shortcuts', description: 'Enhanced navigation with custom shortcuts (Y, N, W, T keys)' },
    { icon: '🌐', title: 'SSR Ready', description: 'Fully compatible with Angular Universal, platform-safe' },
    { icon: '⚙️', title: 'Zoneless Support', description: 'Works with or without Zone.js, OnPush change detection' },
  ];

  public navigationItems = [
    { id: 'getting-started', label: 'Getting Started', sub: false, keywords: 'getting started introduction overview' },
    { id: 'installation', label: 'Installation', sub: false, keywords: 'install setup npm package' },
    { id: 'basic-usage', label: 'Basic Usage', sub: false, keywords: 'basic usage example simple' },
    { id: 'api-reference', label: 'API Reference', sub: false, keywords: 'api reference documentation' },
    { id: 'theming', label: 'Theming', sub: false, keywords: 'theme dark light styling css' },
    { id: 'examples', label: 'Examples', sub: false, keywords: 'examples demo showcase' },
    { id: 'signal-forms', label: 'Signal Forms (Angular 21)', sub: true, keywords: 'signal forms angular 21 reactive' },
    { id: 'single-date', label: 'Single Date', sub: true, keywords: 'single date picker selection' },
    { id: 'customization-a11y', label: 'Customization & A11y', sub: true, keywords: 'customization accessibility a11y aria' },
    { id: 'date-range', label: 'Date Range', sub: true, keywords: 'date range selection start end' },
    { id: 'multiple-dates', label: 'Multiple Dates', sub: true, keywords: 'multiple dates selection array' },
    { id: 'programmatic-value', label: 'Programmatic Value', sub: true, keywords: 'programmatic set value api' },
    { id: 'inline-calendar', label: 'Inline Calendar', sub: true, keywords: 'inline calendar always visible' },
    { id: 'min-max-date', label: 'Min/Max Date', sub: true, keywords: 'min max date limit restriction' },
    { id: 'mobile-playground', label: 'Mobile Playground', sub: true, keywords: 'mobile responsive playground test' },
    { id: 'inputs', label: 'Inputs', sub: false, keywords: 'inputs properties @input parameters' },
    { id: 'outputs', label: 'Outputs', sub: false, keywords: 'outputs events @output emitters' },
  ];

  public inputProperties = [
    { property: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", description: 'Selection mode' },
    { property: 'value', type: 'DatepickerValue', default: 'null', description: 'Programmatic value setting' },
    { property: 'placeholder', type: 'string', default: "'Select Date'", description: 'Input placeholder text' },
    { property: 'minDate', type: 'DateInput | null', default: 'null', description: 'Minimum selectable date' },
    { property: 'maxDate', type: 'DateInput | null', default: 'null', description: 'Maximum selectable date' },
    { property: 'showTime', type: 'boolean', default: 'false', description: 'Show time selection' },
    { property: 'inline', type: "boolean | 'always' | 'auto'", default: 'false', description: 'Inline calendar display' },
    { property: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Theme variant' },
  ];

  public outputProperties = [
    { event: 'valueChange', type: 'EventEmitter<DatepickerValue>', description: 'Emitted when value changes' },
    { event: 'action', type: 'EventEmitter<{ type: string; payload?: any }>', description: 'Emitted on user actions' },
  ];

  public programmaticActions = [
    { label: 'Set Single Date', action: () => this.setSingleDateFromApi() },
    { label: 'Set Date Range', action: () => this.setRangeFromApi() },
    { label: 'Set Multiple Dates', action: () => this.setMultipleDatesFromApi() },
    { label: 'Clear', action: () => this.clearProgrammaticValue() },
  ];

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public lastAction: { type: string; payload?: unknown } | null = null;
  
  public holidayProvider: HolidayProvider = new SampleHolidayProvider();
  public disableHolidays: boolean = true;

  public hasMinDate: boolean = true;
  public minDateInput: string = this.today.toISOString().split('T')[0];

  public hasDisabledDates: boolean = false;
  public disabledDatesArray: string[] = ['10/21/2025', '08/21/2025', '10/15/2025', '10/8/2025', '10/3/2025'];

  public programmaticSingleDate: Date | null = null;
  public programmaticRange: { start: Date; end: Date } | null = null;
  public programmaticMultipleDates: Date[] | null = null;
  public lastProgrammaticChange: Date | null = null;

  public signalDate = signal<DatepickerValue>(null);

  public weekStartDemo: number = 1;
  public yearRangeDemo: number = 20;
  public clearLabelDemo: string = 'Clear';
  public closeLabelDemo: string = 'Close';
  public prevLabelDemo: string = 'Previous month';
  public nextLabelDemo: string = 'Next month';
  public datepickerClasses: { [key: string]: string } = {
    inputGroup: 'rounded-lg border border-purple-300 dark:border-purple-700',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    container: 'bg-white dark:bg-neutral-900',
    calendar: 'p-2',
    header: 'mb-2',
    navPrev: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    navNext: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    dayCell: 'hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-md',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  };

  public datepickerForm = new FormGroup({
    singleDate: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    singleDate2: new FormControl<DatepickerValue>(getStartOfDay(addMonths(this.today, 1))),
    inlineRange: new FormControl({
      value: {start: getStartOfDay(this.today), end: getEndOfDay(this.today)},
      disabled: true
    }),
    rangeWithTime: new FormControl(),
    multipleDates: new FormControl<Date[] | null>(null),
    minDateDemo: new FormControl(),
    disabledDatesDemo: new FormControl(),
  });

  public myRanges: DateRange = {
    'Today': [getStartOfDay(this.today), getEndOfDay(this.today)],
    'Yesterday': [getStartOfDay(subtractDays(this.today, 1)), getEndOfDay(subtractDays(this.today, 1))],
    'Last 7 Days': [getStartOfDay(subtractDays(this.today, 6)), getEndOfDay(this.today)],
    'This Month': [getStartOfMonth(this.today), getEndOfMonth(this.today)],
  };

  public basicUsageCode = `import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent]
})`;

  public basicTemplateCode = `import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export class MyComponent {
  myForm = new FormGroup({
    myDate: new FormControl<DatepickerValue>(null)
  });
}

<form [formGroup]="myForm">
  <ngxsmk-datepicker
    mode="single"
    placeholder="Select a date"
    formControlName="myDate">
  </ngxsmk-datepicker>
</form>`;

  public singleDateCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    placeholder="Select a date"
    formControlName="singleDate">
  </ngxsmk-datepicker>
</form>`;

  public rangeDateCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="range"
    [showTime]="true"
    [minuteInterval]="15"
    [ranges]="myRanges"
    formControlName="rangeWithTime">
  </ngxsmk-datepicker>
</form>`;

  public multipleDatesCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="multiple"
    (action)="handleDatepickerAction($event)"
    formControlName="multipleDates">
  </ngxsmk-datepicker>
</form>`;

  public programmaticCode = `setDateFromApi() {
  const apiDate = new Date();
  apiDate.setDate(apiDate.getDate() + 7);
  this.selectedDate = apiDate;
}

<ngxsmk-datepicker
  [value]="selectedDate"
  (valueChange)="onValueChange($event)">
</ngxsmk-datepicker>`;

  public signalFormsTsCode = `import { signal } from '@angular/core';
import { DatepickerValue } from 'ngxsmk-datepicker';

export class MyComponent {
  dateSig = signal<DatepickerValue>(null);
}`;

  public signalFormsHtmlCode = `<ngxsmk-datepicker
  mode="single"
  [value]="dateSig()"
  (valueChange)="dateSig.set($event)">
</ngxsmk-datepicker>

<p>Signal value: {{ dateSig() | json }}</p>`;

  public inlineCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="range"
    [inline]="true"
    formControlName="inlineRange">
  </ngxsmk-datepicker>
</form>`;

  public minMaxCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [minDate]="minDate"
    [maxDate]="maxDate"
    placeholder="Select a date"
    formControlName="singleDate2">
  </ngxsmk-datepicker>
</form>`;

  public customizationCode = `<ngxsmk-datepicker
  mode="single"
  [weekStart]="1"
  [yearRange]="20"
  [clearLabel]="'Clear'"
  [closeLabel]="'Close'"
  [prevMonthAriaLabel]="'Previous month'"
  [nextMonthAriaLabel]="'Next month'"
  [classes]="{
    inputGroup: 'rounded-lg border',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    dayCell: 'hover:bg-indigo-50',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  }">
</ngxsmk-datepicker>`;

  public themingCssCode = `.custom-datepicker-wrapper {
  --datepicker-primary-color: #3b82f6;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #dbeafe;
  --datepicker-background: #ffffff;
  --datepicker-text-color: #111827;
  --datepicker-subtle-text-color: #6b7280;
  --datepicker-border-color: #d1d5db;
  --datepicker-hover-background: #f3f4f6;
  --datepicker-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --datepicker-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --datepicker-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --datepicker-font-size-base: 15px;
  --datepicker-spacing-md: 14px;
  --datepicker-radius-md: 10px;
}`;

  public themingCssVarsCode = `<div style="
  --datepicker-primary-color: #ec4899;
  --datepicker-primary-contrast: #ffffff;
  --datepicker-range-background: #fce7f3;
">
  <ngxsmk-datepicker mode="single"></ngxsmk-datepicker>
</div>`;

  public designSystemCode = `:host {
  /* TokiForge integration example */
  --datepicker-primary-color: var(--toki-color-primary, #6d28d9);
  --datepicker-primary-contrast: var(--toki-color-on-primary, #ffffff);
  --datepicker-background: var(--toki-color-surface, #ffffff);
  --datepicker-text-color: var(--toki-color-on-surface, #1f2937);
  --datepicker-border-color: var(--toki-color-outline, #e5e7eb);
  
  /* Spacing from design system */
  --datepicker-spacing-sm: var(--toki-spacing-sm, 8px);
  --datepicker-spacing-md: var(--toki-spacing-md, 12px);
  --datepicker-spacing-lg: var(--toki-spacing-lg, 16px);
  
  /* Border radius from design system */
  --datepicker-radius-md: var(--toki-radius-md, 8px);
  --datepicker-radius-lg: var(--toki-radius-lg, 12px);
}`;

  public themingClassesCode = `<ngxsmk-datepicker
  mode="single"
  [classes]="{
    inputGroup: 'rounded-lg border',
    input: 'px-3 py-2 text-sm',
    popover: 'shadow-2xl',
    dayCell: 'hover:bg-indigo-50',
    footer: 'flex justify-end gap-2',
    clearBtn: 'btn btn-ghost',
    closeBtn: 'btn btn-primary'
  }">
</ngxsmk-datepicker>`;

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

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code);
  }


  handleDatepickerAction(event: { type: string; payload?: unknown }): void {
    this.lastAction = event;
  }

  setSingleDateFromApi(): void {
    const apiDate = new Date();
    apiDate.setDate(apiDate.getDate() + 7);
    this.programmaticSingleDate = getStartOfDay(apiDate);
  }

  setRangeFromApi(): void {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 14);
    this.programmaticRange = {
      start: getStartOfDay(start),
      end: getEndOfDay(end)
    };
  }

  setMultipleDatesFromApi(): void {
    const dates: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      dates.push(getStartOfDay(date));
    }
    this.programmaticMultipleDates = dates;
  }

  clearProgrammaticValue(): void {
    this.programmaticSingleDate = null;
    this.programmaticRange = null;
    this.programmaticMultipleDates = null;
    this.lastProgrammaticChange = null;
  }

  onProgrammaticValueChange(value: DatepickerValue): void {
    const dateValue = value instanceof Date ? value : null;
    this.lastProgrammaticChange = dateValue;
    this.programmaticSingleDate = dateValue;
  }

  onProgrammaticRangeChange(value: DatepickerValue): void {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.programmaticRange = value as { start: Date; end: Date };
    } else {
      this.programmaticRange = null;
    }
  }

  onProgrammaticMultipleChange(value: DatepickerValue): void {
    this.programmaticMultipleDates = Array.isArray(value) ? value : null;
  }

  public mobileSizes = [
    { label: 'iPhone SE', width: 375 },
    { label: 'iPhone 12/13', width: 390 },
    { label: 'iPhone 14 Pro', width: 393 },
    { label: 'iPhone 14 Pro Max', width: 430 },
    { label: 'Samsung Galaxy', width: 360 },
    { label: 'Pixel 5', width: 393 },
    { label: 'iPad Mini', width: 768 },
    { label: 'iPad', width: 820 },
  ];

  selectMobileSize(width: number): void {
    this.selectedMobileSize = width;
  }

  getPreviewWidth(): number {
    if (typeof window === 'undefined') {
      return this.selectedMobileSize;
    }
    
    const viewportWidth = window.innerWidth;
    const maxWidth = viewportWidth <= 480 
      ? viewportWidth - 24 // 1.5rem padding
      : viewportWidth <= 768
      ? viewportWidth - 32 // 2rem padding
      : this.selectedMobileSize;
    
    return Math.min(this.selectedMobileSize, maxWidth);
  }

  public mobilePlaygroundCode = `<div class="mobile-preview-container" style="width: 375px;">
  <div class="mobile-preview-frame">
    <div class="mobile-preview-content">
      <ngxsmk-datepicker
        mode="range"
        [inline]="true">
      </ngxsmk-datepicker>
    </div>
  </div>
</div>`;

  private timeInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    this.filteredNavigationItems = [...this.navigationItems];
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Trigger change detection to update preview width
    // The getPreviewWidth() method will be called automatically
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    if (!query || query.trim() === '') {
      this.filteredNavigationItems = [...this.navigationItems];
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    this.filteredNavigationItems = this.navigationItems.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(lowerQuery);
      const keywordMatch = (item.keywords || '').toLowerCase().includes(lowerQuery);
      return labelMatch || keywordMatch;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredNavigationItems = [...this.navigationItems];
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}
