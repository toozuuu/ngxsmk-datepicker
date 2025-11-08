import {Component, HostBinding} from '@angular/core';
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
export class App {
  private readonly today = new Date();
  public readonly JSON = JSON;
  public currentTheme: 'light' | 'dark' = 'light';

  public minDate: Date = getStartOfDay(this.today);
  public maxDate: Date = getEndOfDay(addMonths(this.today, 1));
  public lastAction: any = null;
  
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

  public basicUsageCode = `import { NgxsmkDatepickerComponent } from 'ngxsmk-datepicker';

@Component({
  standalone: true,
  imports: [NgxsmkDatepickerComponent]
})`;

  public basicTemplateCode = `<ngxsmk-datepicker
  mode="single"
  placeholder="Select a date"
  formControlName="myDate">
</ngxsmk-datepicker>`;

  public singleDateCode = `<ngxsmk-datepicker
  mode="single"
  placeholder="Select a date"
  formControlName="singleDate">
</ngxsmk-datepicker>`;

  public rangeDateCode = `<ngxsmk-datepicker
  mode="range"
  [showTime]="true"
  [minuteInterval]="15"
  [ranges]="myRanges"
  formControlName="rangeWithTime">
</ngxsmk-datepicker>`;

  public multipleDatesCode = `<ngxsmk-datepicker
  mode="multiple"
  (action)="handleDatepickerAction($event)"
  formControlName="multipleDates">
</ngxsmk-datepicker>`;

  public programmaticCode = `setDateFromApi() {
  const apiDate = new Date();
  apiDate.setDate(apiDate.getDate() + 7);
  this.selectedDate = apiDate;
}

<ngxsmk-datepicker
  [value]="selectedDate"
  (valueChange)="onValueChange($event)">
</ngxsmk-datepicker>`;

  public inlineCode = `<ngxsmk-datepicker
  mode="range"
  [inline]="true"
  formControlName="inlineRange">
</ngxsmk-datepicker>`;

  public minMaxCode = `<ngxsmk-datepicker
  mode="single"
  [minDate]="minDate"
  [maxDate]="maxDate"
  placeholder="Select a date"
  formControlName="singleDate">
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
    navigator.clipboard.writeText(code).then(() => {
      console.log('Code copied to clipboard');
    });
  }


  handleDatepickerAction(event: { type: string; payload?: any }): void {
    console.log('Datepicker Action:', event);
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
    console.log('Programmatic single date changed:', value);
  }

  onProgrammaticRangeChange(value: DatepickerValue): void {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
      this.programmaticRange = value as { start: Date; end: Date };
    } else {
      this.programmaticRange = null;
    }
    console.log('Programmatic range changed:', value);
  }

  onProgrammaticMultipleChange(value: DatepickerValue): void {
    this.programmaticMultipleDates = Array.isArray(value) ? value : null;
    console.log('Programmatic multiple dates changed:', value);
  }
}
