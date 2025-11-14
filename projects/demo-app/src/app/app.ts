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
  private darkModeMediaQuery: MediaQueryList | null = null;
  private darkModeHandler: ((e: MediaQueryList | MediaQueryListEvent) => void) | null = null;
  private manualThemeOverride: boolean = false;
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
    { id: 'framework-integration', label: 'Framework Integration', sub: false, keywords: 'angular material ionic html input form field' },
    { id: 'api-reference', label: 'API Reference', sub: false, keywords: 'api reference documentation' },
    { id: 'theming', label: 'Theming', sub: false, keywords: 'theme dark light styling css' },
    { id: 'examples', label: 'Examples', sub: false, keywords: 'examples demo showcase' },
    { id: 'signal-forms', label: 'Signal Forms (Angular 21)', sub: true, keywords: 'signal forms angular 21 reactive' },
    { id: 'signal-forms-field', label: 'Signal Forms [field] Input', sub: true, keywords: 'signal forms field input angular 21 FieldTree type compatibility' },
    { id: 'single-date', label: 'Single Date', sub: true, keywords: 'single date picker selection' },
    { id: 'customization-a11y', label: 'Customization & A11y', sub: true, keywords: 'customization accessibility a11y aria' },
    { id: 'date-range', label: 'Date Range', sub: true, keywords: 'date range selection start end' },
    { id: 'time-only', label: 'Time Only', sub: true, keywords: 'time only picker time selection no calendar' },
    { id: 'custom-format', label: 'Custom Format', sub: true, keywords: 'custom format display format date format string MM DD YYYY hh mm' },
    { id: 'rtl-support', label: 'RTL Support', sub: true, keywords: 'rtl right to left arabic hebrew persian urdu mirror' },
    { id: 'timezone-support', label: 'Timezone Support', sub: true, keywords: 'timezone time zone utc iana formatting parsing' },
    { id: 'multiple-dates', label: 'Multiple Dates', sub: true, keywords: 'multiple dates selection array' },
    { id: 'programmatic-value', label: 'Programmatic Value', sub: true, keywords: 'programmatic set value api' },
    { id: 'inline-calendar', label: 'Inline Calendar', sub: true, keywords: 'inline calendar always visible' },
    { id: 'min-max-date', label: 'Min/Max Date', sub: true, keywords: 'min max date limit restriction' },
    { id: 'calendar-views', label: 'Calendar Views', sub: true, keywords: 'year picker decade picker timeline time slider view mode' },
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
    { property: 'timeOnly', type: 'boolean', default: 'false', description: 'Display time picker only (no calendar)' },
    { property: 'displayFormat', type: 'string', default: 'undefined', description: 'Custom date format string (e.g., "MM/DD/YYYY hh:mm A"). Works with date adapters or built-in simple formatter.' },
    { property: 'rtl', type: 'boolean | null', default: 'null', description: 'Right-to-left layout support (auto-detects from document.dir or locale)' },
    { property: 'timezone', type: 'string', default: 'undefined', description: 'IANA timezone name for date formatting (e.g., "America/New_York", "UTC")' },
    { property: 'inline', type: "boolean | 'always' | 'auto'", default: 'false', description: 'Inline calendar display' },
    { property: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Theme variant' },
    { property: 'calendarViewMode', type: "'month' | 'year' | 'decade' | 'timeline' | 'time-slider'", default: "'month'", description: 'Calendar view mode (year picker, decade picker, timeline, or time slider)' },
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

  public yearPickerView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'year';
  public decadePickerView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'decade';
  public timelineView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'timeline';
  public timeSliderView: 'month' | 'year' | 'decade' | 'timeline' | 'time-slider' = 'time-slider';
  public yearPickerValue: DatepickerValue = null;
  public decadePickerValue: DatepickerValue = null;
  public timelineRange: DatepickerValue = null;
  public timeSliderRange: DatepickerValue = null;

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
    timeOnly: new FormControl<DatepickerValue>(null),
    customFormat: new FormControl<DatepickerValue>(null),
    rtlDate: new FormControl<DatepickerValue>(null),
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

  public materialFormCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxsmkDatepickerComponent
  ],
  template: \`
    <form [formGroup]="myForm">
      <mat-form-field appearance="outline">
        <mat-label>Select Date</mat-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="date"
          placeholder="Choose a date">
        </ngxsmk-datepicker>
      </mat-form-field>
    </form>
  \`
})
export class MaterialFormComponent {
  myForm = new FormGroup({
    date: new FormControl<Date | null>(null)
  });
}`;

  public ionicFormCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-ionic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    NgxsmkDatepickerComponent
  ],
  template: \`
    <form [formGroup]="myForm">
      <ion-item>
        <ion-label position="stacked">Appointment Date</ion-label>
        <ngxsmk-datepicker
          mode="single"
          formControlName="appointmentDate"
          placeholder="Select date">
        </ngxsmk-datepicker>
      </ion-item>
    </form>
  \`
})
export class IonicFormComponent {
  myForm = new FormGroup({
    appointmentDate: new FormControl<Date | null>(null)
  });
}`;

  public plainHtmlCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-plain-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgxsmkDatepickerComponent],
  template: \`
    <form [formGroup]="myForm">
      <label for="birthdate">Birth Date</label>
      <ngxsmk-datepicker
        id="birthdate"
        mode="single"
        formControlName="birthdate"
        placeholder="MM/DD/YYYY">
      </ngxsmk-datepicker>
      
      <button type="submit">Submit</button>
    </form>
  \`
})
export class PlainFormComponent {
  myForm = new FormGroup({
    birthdate: new FormControl<Date | null>(null)
  });
}`;

  public materialRangeCode = `<mat-form-field appearance="fill">
  <mat-label>Date Range</mat-label>
  <ngxsmk-datepicker
    mode="range"
    [showTime]="true"
    formControlName="dateRange">
  </ngxsmk-datepicker>
</mat-form-field>`;

  public ionicRangeCode = `<ion-item>
  <ion-label>Check-in / Check-out</ion-label>
  <ngxsmk-datepicker
    mode="range"
    [theme]="'light'"
    formControlName="bookingDates">
  </ngxsmk-datepicker>
</ion-item>`;

  public plainHtmlValidationCode = `<form [formGroup]="myForm">
  <div class="form-group">
    <label for="event-date">Event Date *</label>
    <ngxsmk-datepicker
      id="event-date"
      mode="single"
      formControlName="eventDate"
      [minDate]="today"
      required>
    </ngxsmk-datepicker>
  </div>
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

  public timeOnlyCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [timeOnly]="true"
    [minuteInterval]="15"
    formControlName="timeOnly">
  </ngxsmk-datepicker>
</form>`;

  public customFormatCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [displayFormat]="'MM/DD/YYYY hh:mm A'"
    [showTime]="true"
    placeholder="Select Date & Time"
    formControlName="customFormat">
  </ngxsmk-datepicker>
</form>

<!-- Other format examples: -->
<!-- [displayFormat]="'YYYY-MM-DD'" -->
<!-- [displayFormat]="'DD/MM/YYYY'" -->
<!-- [displayFormat]="'MMM DD, YYYY hh:mm A'" -->
<!-- [displayFormat]="'MM/DD/YYYY'" -->`;

  public rtlCode = `<form [formGroup]="datepickerForm">
  <ngxsmk-datepicker
    mode="single"
    [rtl]="true"
    [locale]="'ar-SA'"
    placeholder="اختر تاريخ"
    formControlName="rtlDate">
  </ngxsmk-datepicker>
</form>`;

  public rtlAutoCode = `<ngxsmk-datepicker
  mode="single"
  [locale]="'ar-SA'">
</ngxsmk-datepicker>

<!-- Auto-detects RTL from locale or document.dir -->`;

  public globalConfigCode = `import { ApplicationConfig } from '@angular/core';
import { provideDatepickerConfig } from 'ngxsmk-datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDatepickerConfig({
      weekStart: 1, // Monday as first day of week
      minuteInterval: 15, // 15-minute intervals
      yearRange: 20, // Show 20 years before/after
      holidayProvider: myHolidayProvider, // Optional
      locale: 'en-US' // Optional
    })
  ]
};`;

  public timezoneCode = `<ngxsmk-datepicker
  mode="single"
  [timezone]="'America/New_York'"
  [showTime]="true"
  placeholder="New York Time">
</ngxsmk-datepicker>

<!-- Global timezone via config provider -->
provideDatepickerConfig({
  timezone: 'America/New_York'
})`;

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

  public signalFormsFieldTsCode = `import { Component, signal, form, objectSchema } from '@angular/core';
import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [NgxsmkDatepickerComponent],
  template: \`
    <form>
      <ngxsmk-datepicker
        [field]="myForm.myDate"
        mode="single"
        placeholder="Select a date">
      </ngxsmk-datepicker>
    </form>
  \`
})
export class FormComponent {
  localObject = signal({ myDate: new Date() });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date>()
  }));
}`;

  public signalFormsFieldHtmlCode = `<form>
  <ngxsmk-datepicker
    [field]="myForm.myDate"
    mode="single"
    placeholder="Select a date">
  </ngxsmk-datepicker>
</form>

<!-- The [field] input automatically:
     - Syncs value from form to datepicker
     - Updates form when datepicker value changes
     - Handles disabled state automatically -->`;

  public signalFormsFieldExampleCode = `// Example: Using with validation
import { Component, signal, form, objectSchema, validators } from '@angular/core';

export class ValidatedFormComponent {
  localObject = signal({ 
    myDate: null as Date | null 
  });
  
  myForm = form(this.localObject, objectSchema({
    myDate: objectSchema<Date | null>({
      validators: [
        validators.required()
      ]
    })
  }));
}

// Example: Date range with Signal Forms
export class RangeFormComponent {
  localObject = signal({
    startDate: new Date(),
    endDate: new Date()
  });
  
  myForm = form(this.localObject, objectSchema({
    startDate: objectSchema<Date>(),
    endDate: objectSchema<Date>()
  }));
}

<!-- In template -->
<ngxsmk-datepicker
  [field]="myForm.startDate"
  mode="single"
  placeholder="Start date">
</ngxsmk-datepicker>

<ngxsmk-datepicker
  [field]="myForm.endDate"
  mode="single"
  placeholder="End date">
</ngxsmk-datepicker>

<!-- Or use a single range picker -->
<ngxsmk-datepicker
  [field]="myForm.dateRange"
  mode="range">
</ngxsmk-datepicker>`;

  public calendarViewsCode = `
<!-- Year Picker -->
<ngxsmk-datepicker
  mode="single"
  calendarViewMode="year"
  placeholder="Select birth year">
</ngxsmk-datepicker>

<!-- Decade Picker -->
<ngxsmk-datepicker
  mode="single"
  calendarViewMode="decade"
  placeholder="Select decade">
</ngxsmk-datepicker>

<!-- Timeline View (Range Mode) -->
<ngxsmk-datepicker
  mode="range"
  calendarViewMode="timeline"
  placeholder="Select date range">
</ngxsmk-datepicker>

<!-- Time Slider View (Range Mode with Time) -->
<ngxsmk-datepicker
  mode="range"
  calendarViewMode="time-slider"
  [showTime]="true"
  placeholder="Select time range">
</ngxsmk-datepicker>
`;

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
  --datepicker-primary-color: var(--toki-color-primary, #6d28d9);
  --datepicker-primary-contrast: var(--toki-color-on-primary, #ffffff);
  --datepicker-background: var(--toki-color-surface, #ffffff);
  --datepicker-text-color: var(--toki-color-on-surface, #1f2937);
  --datepicker-border-color: var(--toki-color-outline, #e5e7eb);
  
  --datepicker-spacing-sm: var(--toki-spacing-sm, 8px);
  --datepicker-spacing-md: var(--toki-spacing-md, 12px);
  --datepicker-spacing-lg: var(--toki-spacing-lg, 16px);
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
    this.manualThemeOverride = true;
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  private detectSystemTheme(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.darkModeHandler = (e: MediaQueryList | MediaQueryListEvent) => {
      if (!this.manualThemeOverride) {
        this.currentTheme = e.matches ? 'dark' : 'light';
      }
    };

    if (this.darkModeHandler) {
      this.darkModeHandler(this.darkModeMediaQuery);
    }
    
    if (this.darkModeMediaQuery.addEventListener) {
      this.darkModeMediaQuery.addEventListener('change', this.darkModeHandler);
    } else {
      this.darkModeMediaQuery.addListener(this.darkModeHandler as any);
    }
  }

  private cleanupThemeListener(): void {
    if (this.darkModeMediaQuery && this.darkModeHandler) {
      if (this.darkModeMediaQuery.removeEventListener) {
        this.darkModeMediaQuery.removeEventListener('change', this.darkModeHandler);
      } else {
        this.darkModeMediaQuery.removeListener(this.darkModeHandler as any);
      }
      this.darkModeMediaQuery = null;
      this.darkModeHandler = null;
    }
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
    this.cleanupThemeListener();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
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

  isDate(value: any): value is Date {
    return value instanceof Date;
  }
}
