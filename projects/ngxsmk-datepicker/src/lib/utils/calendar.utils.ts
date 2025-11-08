import { DateInput, normalizeDate } from './date.utils';

export interface HolidayProvider {
  /**
   * Returns true if the given date is a holiday.
   * The date passed will be at the start of the day (00:00:00).
   */
  isHoliday(date: Date): boolean;
  
  /**
   * Optional: Returns a label or reason for the holiday.
   */
  getHolidayLabel?(date: Date): string | null;
}

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

export type DatepickerValue = Date | { start: Date, end: Date } | Date[] | null;

/**
 * Generate month options for dropdown
 */
export function generateMonthOptions(locale: string, year: number): { label: string; value: number }[] {
  return Array.from({length: 12}).map((_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString(locale, {month: 'long'}),
    value: i,
  }));
}

/**
 * Generate year options for dropdown
 */
export function generateYearOptions(currentYear: number, range: number = 10): { label: string; value: number }[] {
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  const options: { label: string; value: number }[] = [];
  
  for (let i = startYear; i <= endYear; i++) {
    options.push({label: `${i}`, value: i});
  }
  
  return options;
}

/**
 * Generate time options for hour/minute dropdowns
 */
export function generateTimeOptions(minuteInterval: number = 1): {
  hourOptions: { label: string; value: number }[];
  minuteOptions: { label: string; value: number }[];
} {
  const hourOptions = Array.from({length: 12}).map((_, i) => ({
    label: (i + 1).toString().padStart(2, '0'),
    value: i + 1,
  }));

  const minuteOptions: { label: string; value: number }[] = [];
  for (let i = 0; i < 60; i += minuteInterval) {
    minuteOptions.push({
      label: i.toString().padStart(2, '0'),
      value: i,
    });
  }

  return { hourOptions, minuteOptions };
}

/**
 * Generate week days for calendar header
 */
export function generateWeekDays(locale: string, firstDayOfWeek: number = 0): string[] {
  const day = new Date(2024, 0, 7 + firstDayOfWeek);
  return Array.from({length: 7}).map(() => {
    const weekDay = new Date(day).toLocaleDateString(locale, {weekday: 'short'});
    day.setDate(day.getDate() + 1);
    return weekDay;
  });
}

/**
 * Get first day of week for locale
 */
export function getFirstDayOfWeek(locale: string): number {
  try {
    return ((new Intl.Locale(locale) as any).weekInfo?.firstDay || 0) % 7;
  } catch (e) {
    return 0;
  }
}

/**
 * Convert 12-hour to 24-hour format
 */
export function get24Hour(displayHour: number, isPm: boolean): number {
  if (isPm) { return displayHour === 12 ? 12 : displayHour + 12; }
  return displayHour === 12 ? 0 : displayHour;
}

/**
 * Convert 24-hour to 12-hour format
 */
export function update12HourState(fullHour: number): { isPm: boolean; displayHour: number } {
  return {
    isPm: fullHour >= 12,
    displayHour: fullHour % 12 || 12
  };
}

/**
 * Process date ranges input
 */
export function processDateRanges(ranges: DateRange | null): { [key: string]: [Date, Date] } | null {
  if (!ranges) return null;
  
  return Object.entries(ranges).reduce((acc, [key, dates]) => {
    const start = normalizeDate(dates[0]);
    const end = normalizeDate(dates[1]);
    if (start && end) acc[key] = [start, end];
    return acc;
  }, {} as { [key: string]: [Date, Date] });
}


