/**
 * Luxon Adapter Implementation
 * 
 * To use this adapter, install luxon:
 * npm install luxon
 * 
 * Then provide it in your app config:
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * import { LuxonAdapter } from 'ngxsmk-datepicker/adapters/luxon-adapter';
 * 
 * provideDatepickerConfig({
 *   dateAdapter: new LuxonAdapter()
 * })
 * ```
 */

import { DateAdapter } from './date-adapter.interface';

declare const require: (module: string) => any;

export class LuxonAdapter implements DateAdapter {
  private DateTime: any;

  constructor() {
    try {
      this.DateTime = require('luxon').DateTime;
    } catch {
      throw new Error('luxon is not installed. Please install it: npm install luxon');
    }
  }

  parse(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) {
      return this.DateTime.fromJSDate(value).isValid ? new Date(value.getTime()) : null;
    }
    if (typeof value === 'string') {
      const parsed = this.DateTime.fromISO(value) || this.DateTime.fromFormat(value, 'yyyy-MM-dd');
      return parsed.isValid ? parsed.toJSDate() : null;
    }
    return null;
  }

  format(date: Date, formatStr: string = 'MMM dd, yyyy', locale?: string): string {
    if (!date) return '';
    
    try {
      const dt = this.DateTime.fromJSDate(date);
      if (!dt.isValid) return '';
      
      const options: any = {};
      if (locale) {
        options.locale = locale;
      }
      
      return dt.toFormat(formatStr, options);
    } catch {
      return '';
    }
  }

  isValid(value: any): boolean {
    if (value instanceof Date) {
      return this.DateTime.fromJSDate(value).isValid;
    }
    return this.DateTime.fromISO(value).isValid || this.DateTime.fromFormat(value, 'yyyy-MM-dd').isValid;
  }

  startOfDay(date: Date): Date {
    return this.DateTime.fromJSDate(date).startOf('day').toJSDate();
  }

  endOfDay(date: Date): Date {
    return this.DateTime.fromJSDate(date).endOf('day').toJSDate();
  }

  addMonths(date: Date, months: number): Date {
    return this.DateTime.fromJSDate(date).plus({ months }).toJSDate();
  }

  addDays(date: Date, days: number): Date {
    return this.DateTime.fromJSDate(date).plus({ days }).toJSDate();
  }

  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    const dt1 = this.DateTime.fromJSDate(date1);
    const dt2 = this.DateTime.fromJSDate(date2);
    return dt1.hasSame(dt2, 'day');
  }
}

