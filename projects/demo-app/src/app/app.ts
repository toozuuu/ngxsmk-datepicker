import {Component, HostBinding} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {
  DateRange,
  NgxsmkDatepickerComponent,
  HolidayProvider,
} from "ngxsmk-datepicker";

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
    // 2025 US Holidays (Simplified list)
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
// ----------------------------------------------------


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent, ReactiveFormsModule, FormsModule],
  template: `
    <header class="app-header">
      <h1>ngxsmk-datepicker Demo</h1>
      <button class="theme-toggle" (click)="toggleTheme()">
        Toggle Theme (Current: {{ currentTheme }})
      </button>
    </header>

    <main class="content" [formGroup]="datepickerForm">

      <section class="example-container">
        <h2>Holiday Provider Integration 🎁</h2>
        <p>
          This example uses a custom <code>HolidayProvider</code> class to automatically mark 
          (and optionally disable) US holidays. The dates are colored and the name is available via a tooltip.
        </p>

        <div class="holiday-controls">
            <label>
                <input type="checkbox" [checked]="disableHolidays" (change)="disableHolidays = !disableHolidays">
                Disable Holidays
            </label>
        </div>

        <ngxsmk-datepicker
          mode="single"
          placeholder="Select a date"
          [holidayProvider]="holidayProvider"
          [disableHolidays]="disableHolidays"
          [theme]="currentTheme"
          formControlName="singleDate">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.singleDate.value) }}</p>
          <strong>Holiday Tooltip Test:</strong>
          <p>Hover over January 1, 2025 to see "New Year's Day" tooltip</p>
          <p>Hover over July 4, 2025 to see "Independence Day" tooltip</p>
        </div>
      </section>

      <section class="example-container">
        <h2>Single Date Picker</h2>
        <p>
          This is the default mode, with a popover calendar. It includes a clear button and min/max date validation.
        </p>

        <ngxsmk-datepicker
          mode="single"
          [minDate]="minDate"
          [maxDate]="maxDate"
          [theme]="currentTheme"
          placeholder="Select a date"
          formControlName="singleDate2">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.singleDate2.value) }}</p>
        </div>
      </section>

      <section class="example-container">
        <h2>Inline Range Picker</h2>
        <p>
          The calendar is always visible (<code>inline="true"</code>) and allows selecting a date range. The form control is initially disabled.
        </p>

        <ngxsmk-datepicker
          mode="range"
          [inline]="true"
          [theme]="currentTheme"
          [minDate]="minDate"
          formControlName="inlineRange">
        </ngxsmk-datepicker>
        <br>
        <button class="toggle-button" (click)="toggleDisabled()">Toggle Disabled State</button>

        <div class="result-box">
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.inlineRange.value) }}</p>
          <strong>Status:</strong> {{ datepickerForm.controls.inlineRange.status }}
        </div>
      </section>

      <section class="example-container">
        <h2>Date Range Picker with Time</h2>
        <p>
          A popover range picker with time selection and predefined ranges. Weekends are disabled.
        </p>

        <ngxsmk-datepicker
          mode="range"
          [ranges]="myRanges"
          [showTime]="true"
          [minuteInterval]="15"
          [isInvalidDate]="isWeekend"
          [theme]="currentTheme"
          formControlName="rangeWithTime">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.rangeWithTime.value) }}</p>
        </div>
      </section>

      <section class="example-container">
        <h2>Multiple Date Selection</h2>
        <p>
          Select multiple, non-contiguous dates. The <code>action</code> output logs events to the console.
        </p>

        <ngxsmk-datepicker
          mode="multiple"
          [isInvalidDate]="isWeekend"
          [theme]="currentTheme"
          (action)="handleDatepickerAction($event)"
          formControlName="multipleDates">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.multipleDates.value) }}</p>
          <strong>Last Action:</strong>
          <p>{{ JSON.stringify(lastAction) }}</p>
        </div>
      </section>

      <section class="example-container">
        <h2>Disabled Dates Array 🚫</h2>
        <p>
          This example demonstrates the new <code>disabledDates</code> input property. 
          You can pass an array of date strings or Date objects to disable specific dates.
          The dates in the array will be disabled and cannot be selected.
        </p>

        <div class="disabled-dates-controls">
          <label>
            <strong>Disabled Dates:</strong>
            <p class="disabled-dates-list">{{ disabledDatesArray.join(', ') }}</p>
          </label>
          <button class="toggle-button" (click)="toggleDisabledDates()">
            {{ hasDisabledDates ? 'Remove Disabled Dates' : 'Add Sample Disabled Dates' }}
          </button>
        </div>

        <ngxsmk-datepicker
          mode="single"
          [disabledDates]="hasDisabledDates ? disabledDatesArray : []"
          [theme]="currentTheme"
          placeholder="Try selecting the disabled dates - they will be grayed out"
          formControlName="disabledDatesDemo">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Disabled Dates:</strong>
          <p>{{ hasDisabledDates ? disabledDatesArray.join(', ') : 'None' }}</p>
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.disabledDatesDemo.value) }}</p>
        </div>
      </section>

      <section class="example-container">
        <h2>Back Arrow Disable with minDate 🚫</h2>
        <p>
          When <code>minDate</code> is set, the back arrow automatically disables to prevent navigation 
          to months before the minimum date. This provides better UX by preventing users from navigating 
          to invalid date ranges.
        </p>

        <div class="min-date-controls">
          <label>
            <strong>Min Date:</strong>
            <input type="date" 
                   [value]="minDateInput" 
                   (change)="updateMinDate($event)"
                   class="date-input">
          </label>
          <button class="toggle-button" (click)="toggleMinDate()">
            {{ hasMinDate ? 'Remove minDate' : 'Set minDate to Today' }}
          </button>
        </div>

        <ngxsmk-datepicker
          mode="single"
          [minDate]="hasMinDate ? minDate : null"
          [theme]="currentTheme"
          placeholder="Try navigating back - arrow will be disabled"
          formControlName="minDateDemo">
        </ngxsmk-datepicker>

        <div class="result-box">
          <strong>Current minDate:</strong>
          <p>{{ hasMinDate ? (minDate | date:'medium') : 'None' }}</p>
          <strong>Form Value:</strong>
          <p>{{ JSON.stringify(datepickerForm.controls.minDateDemo.value) }}</p>
        </div>
      </section>

     </main>

     <footer class="app-footer">
       <div class="footer-content">
         <div class="footer-brand">
           <h3>ngxsmk-datepicker</h3>
           <p>Optimized for performance, built for developers</p>
           <div class="version-info">
             <span class="version-badge">v1.4.7</span>
           </div>
         </div>
         
         <div class="footer-links">
           <a href="https://github.com/toozuuu/ngxsmk-datepicker" target="_blank" rel="noopener noreferrer" class="github-link">
             <span class="github-icon">📁</span>
             GitHub Repository
           </a>
           <div class="author-info">
             <span class="author-label">Created by:</span>
             <span class="author-name">Sachin Dilshan</span>
             <a href="mailto:sachindilshan040@gmail.com" class="author-email">sachindilshan040@gmail.com</a>
           </div>
         </div>
         
         <div class="footer-stats">
           <div class="footer-stat">
             <span class="stat-value">30%</span>
             <span class="stat-desc">Smaller Bundle</span>
           </div>
           <div class="footer-stat">
             <span class="stat-value">40%</span>
             <span class="stat-desc">Faster Render</span>
           </div>
           <div class="footer-stat">
             <span class="stat-value">60%</span>
             <span class="stat-desc">Faster Selection</span>
           </div>
         </div>
       </div>
     </footer>
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
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f5f8;
      min-height: 100vh;
      overflow-x: hidden;
    }

    :host(.dark-theme) {
      --datepicker-range-background: rgba(139, 92, 246, 0.2);
      --datepicker-background: #1f2937;
      --datepicker-text-color: #d1d5db;
      --datepicker-subtle-text-color: #6b7280;
      --datepicker-border-color: #4b5563;
      --datepicker-hover-background: #374151;
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

    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .theme-toggle, .toggle-button {
      background-color: #3b82f6;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .toggle-button {
      background-color: #10b981;
    }

    .theme-toggle:hover {
      background-color: #2563eb;
    }

    .toggle-button:hover {
      background-color: #059669;
    }

    @media (max-width: 600px) {
      .app-header {
        padding: 1rem 1rem;
        flex-direction: column;
        gap: 8px;
      }
      .app-header h1 {
        font-size: 1.25rem;
      }
    }

    .content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    @media (max-width: 600px) {
      .content {
        padding: 1rem;
        gap: 1.5rem;
      }
    }

    .example-container {
      width: 100%;
      max-width: 620px;
      padding: 1.5rem;
      background: var(--datepicker-background, #ffffff);
      border-radius: 12px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .holiday-controls, .min-date-controls, .disabled-dates-controls {
        width: 100%;
        padding: 8px 12px;
        margin-bottom: 12px;
        border: 1px solid var(--datepicker-border-color);
        border-radius: 8px;
        background-color: var(--datepicker-hover-background);
        font-size: 0.9rem;
        color: var(--datepicker-text-color);
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .holiday-controls label, .min-date-controls label, .disabled-dates-controls label {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .disabled-dates-list {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        font-size: 0.85rem;
        color: var(--datepicker-subtle-text-color);
        margin: 4px 0;
        word-break: break-all;
    }
    .min-date-controls {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .date-input {
        padding: 6px 8px;
        border: 1px solid var(--datepicker-border-color);
        border-radius: 4px;
        background-color: var(--datepicker-background);
        color: var(--datepicker-text-color);
        font-size: 0.9rem;
    }
    @media (max-width: 600px) {
      .min-date-controls {
        flex-direction: column;
        align-items: stretch;
      }
    }
    
    :host(.dark-theme) .example-container {
      background: #1f2937;
      color: #e5e7eb;
    }

    .example-container h2 {
      font-weight: 600;
      margin-top: 0;
      color: var(--datepicker-text-color, #333);
    }

    .example-container p {
      color: var(--datepicker-subtle-text-color, #666);
      font-size: 1rem;
      margin-bottom: 24px;
      border-left: 4px solid var(--datepicker-border-color, #e1e4e8);
      padding-left: 12px;
      line-height: 1.5;
      width: 100%;
    }

    .result-box {
      margin-top: 24px;
      padding: 1rem;
      background-color: var(--datepicker-hover-background, #f6f8fa);
      border: 1px solid var(--datepicker-border-color, #d1d5da);
      border-radius: 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 0.95rem;
      word-wrap: break-word;
      color: var(--datepicker-text-color, #24292e);
      width: 100%;
    }

    .result-box strong {
      font-weight: 600;
    }

    .locale-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }

    .locale-buttons button {
      background-color: #04aa6d;
      border: none;
      color: white;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      font-size: 14px;
      border-radius: 12px;
      cursor: pointer;
      min-height: 44px;
      min-width: 44px;
      transition: background-color 0.2s;
    }

     .locale-buttons button.active {
       background-color: #037f52;
       box-shadow: 0 0 0 3px rgba(4, 170, 109, 0.4);
     }

     /* Footer Styles */
     .app-footer {
       background: var(--datepicker-background, #ffffff);
       color: var(--datepicker-text-color, #333);
       padding: 2rem 0;
       margin-top: 3rem;
       border-top: 1px solid var(--datepicker-border-color, #e9e9e9);
     }

     .footer-content {
       max-width: 1200px;
       margin: 0 auto;
       padding: 0 2rem;
       display: grid;
       grid-template-columns: 1fr 1fr 1fr;
       gap: 2rem;
       align-items: start;
     }

     .footer-brand h3 {
       font-size: 1.5rem;
       font-weight: 700;
       margin: 0 0 0.5rem 0;
       color: var(--datepicker-text-color, #333);
     }

     .footer-brand p {
       color: var(--datepicker-subtle-text-color, #666);
       margin: 0 0 1rem 0;
       font-size: 0.95rem;
     }

     .version-info {
       margin-top: 0.5rem;
     }

     .version-badge {
       display: inline-block;
       background: var(--datepicker-primary-color, #6d28d9);
       padding: 0.25rem 0.75rem;
       border-radius: 1rem;
       font-size: 0.8rem;
       font-weight: 600;
       color: white;
       border: 1px solid var(--datepicker-primary-color, #6d28d9);
     }

     .footer-links {
       display: flex;
       flex-direction: column;
       gap: 1rem;
     }

     .github-link {
       display: inline-flex;
       align-items: center;
       gap: 0.5rem;
       color: var(--datepicker-primary-color, #6d28d9);
       text-decoration: none;
       font-weight: 600;
       padding: 0.5rem 1rem;
       border: 1px solid var(--datepicker-primary-color, #6d28d9);
       border-radius: 0.5rem;
       transition: all 0.2s ease;
       background: var(--datepicker-range-background, #f5f3ff);
     }

     .github-link:hover {
       background: var(--datepicker-primary-color, #6d28d9);
       color: white;
       transform: translateY(-1px);
     }

     .github-icon {
       font-size: 1.25rem;
     }

     .author-info {
       display: flex;
       flex-direction: column;
       gap: 0.25rem;
     }

     .author-label {
       font-size: 0.875rem;
       color: var(--datepicker-subtle-text-color, #666);
       font-weight: 500;
     }

     .author-name {
       font-weight: 600;
       color: var(--datepicker-text-color, #333);
     }

     .author-email {
       color: var(--datepicker-primary-color, #6d28d9);
       text-decoration: none;
       font-size: 0.875rem;
     }

     .author-email:hover {
       text-decoration: underline;
     }

     .footer-stats {
       display: flex;
       flex-direction: column;
       gap: 1rem;
     }

     .footer-stat {
       display: flex;
       flex-direction: column;
       align-items: center;
       text-align: center;
     }

     .stat-value {
       font-size: 1.5rem;
       font-weight: 700;
       color: var(--datepicker-primary-color, #6d28d9);
       line-height: 1;
     }

     .stat-desc {
       font-size: 0.875rem;
       color: var(--datepicker-subtle-text-color, #666);
       font-weight: 500;
     }

     /* Responsive Footer */
     @media (max-width: 768px) {
       .footer-content {
         grid-template-columns: 1fr;
         gap: 1.5rem;
         text-align: center;
       }

       .footer-links {
         align-items: center;
       }

       .footer-stats {
         flex-direction: row;
         justify-content: space-around;
       }
     }

     @media (max-width: 480px) {
       .footer-stats {
         flex-direction: column;
         gap: 0.5rem;
       }
     }
   `],
})
export class App {
  private readonly today = new Date();
  public readonly JSON = JSON;

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public currentTheme: 'light' | 'dark' = 'light';
  public lastAction: any = null;
  
  // NEW: Holiday Provider
  public holidayProvider: HolidayProvider = new SampleHolidayProvider();
  public disableHolidays: boolean = true; // State for the checkbox

  // MinDate Demo Properties
  public hasMinDate: boolean = true;
  public minDateInput: string = this.today.toISOString().split('T')[0];

  // Disabled Dates Demo Properties
  public hasDisabledDates: boolean = false;
  public disabledDatesArray: string[] = ['10/21/2025', '08/21/2025', '10/15/2025', '10/8/2025', '10/3/2025'];

  public datepickerForm = new FormGroup({
    singleDate: new FormControl(getStartOfDay(addMonths(this.today, 1))),
    singleDate2: new FormControl(getStartOfDay(addMonths(this.today, 1))),
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

  toggleDisabled(): void {
    const control = this.datepickerForm.controls.inlineRange;
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

  handleDatepickerAction(event: { type: string; payload?: any }): void {
    console.log('Datepicker Action:', event);
    this.lastAction = event;
  }

  updateMinDate(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.minDate = getStartOfDay(new Date(target.value));
      this.minDateInput = target.value;
    }
  }

  toggleMinDate(): void {
    this.hasMinDate = !this.hasMinDate;
    if (this.hasMinDate) {
      this.minDate = getStartOfDay(this.today);
      this.minDateInput = this.today.toISOString().split('T')[0];
    }
  }

  toggleDisabledDates(): void {
    this.hasDisabledDates = !this.hasDisabledDates;
  }
}
