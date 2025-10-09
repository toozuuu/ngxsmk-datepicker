import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsmkDatepickerComponent, DateRange } from 'ngxsmk-datepicker';
import dayjs from 'dayjs';
import moment from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxsmkDatepickerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public singleDateResult: string = 'No date selected yet.';
  public selectedRange: string = 'No date range selected yet.';
  public minDate: Date = new Date();
  public maxDate: string = '2025-12-31';
  public activeLocale: string = 'en-US';

  // NEW: Property to manage the current theme
  public currentTheme: 'light' | 'dark' = 'light';

  // NEW: Bind the theme class to the host element for global styling
  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  public myRanges: DateRange = {
    Today: [new Date(), new Date()],
    Yesterday: [dayjs().subtract(1, 'day'), dayjs()],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
  };

  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // NEW: Method to toggle the theme
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }

  setLocale(locale: string): void {
    this.activeLocale = locale;
  }

  handleSingleDateChange(selectedDate: Date | { start: Date; end: Date }): void {
    if (selectedDate instanceof Date) {
      this.singleDateResult = `Selected: ${selectedDate.toLocaleDateString()}`;
    }
  }

  handleRangeChange(range: Date | { start: Date; end: Date }): void {
    const r = range as { start: Date; end: Date };
    if (r?.start && r.end) {
      this.selectedRange = `From: ${r.start.toLocaleDateString()} | To: ${r.end.toLocaleDateString()}`;
    }
  }
}

