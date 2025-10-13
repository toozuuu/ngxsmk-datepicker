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
  public maxDate: Date = new Date(new Date().setDate(new Date().getDate() + 7));
  public activeLocale: string = 'en-US';

  public currentTheme: 'light' | 'dark' = 'light';

  @HostBinding('class.dark-theme') get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  // Initial date range value set 4 months from now (e.g., February 2026) to test view centering
  public initialRangeValue: { start: Date; end: Date } = {
    start: dayjs().add(4, 'month').startOf('day').toDate(),
    end: dayjs().add(4, 'month').endOf('day').toDate(),
  };

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
    } else if (r?.start) {
      this.selectedRange = `Start Date: ${r.start.toLocaleDateString()}`;
    }
    // Update the internal value to simulate persistence and allow re-opening the view on the current selection
    this.initialRangeValue = r as { start: Date; end: Date };
  }
}
