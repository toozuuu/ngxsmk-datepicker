import { DateInput, normalizeDate } from './date.utils';

export interface HolidayProvider {
  isHoliday(date: Date): boolean;
  getHolidayLabel?(date: Date): string | null;
}

export interface DateRange {
  [key: string]: [DateInput, DateInput];
}

export type DatepickerValue = Date | { start: Date, end: Date } | Date[] | null;

export function generateMonthOptions(locale: string, year: number): { label: string; value: number }[] {
  return Array.from({length: 12}).map((_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString(locale, {month: 'long'}),
    value: i,
  }));
}

export function generateYearOptions(currentYear: number, range: number = 10): { label: string; value: number }[] {
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  const options: { label: string; value: number }[] = [];
  
  for (let i = startYear; i <= endYear; i++) {
    options.push({label: `${i}`, value: i});
  }
  
  return options;
}

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

export function generateWeekDays(locale: string, firstDayOfWeek: number = 0): string[] {
  const day = new Date(2024, 0, 7 + firstDayOfWeek);
  return Array.from({length: 7}).map(() => {
    const weekDay = new Date(day).toLocaleDateString(locale, {weekday: 'short'});
    day.setDate(day.getDate() + 1);
    return weekDay;
  });
}

export function getFirstDayOfWeek(locale: string): number {
  try {
    return ((new Intl.Locale(locale) as { weekInfo?: { firstDay?: number } }).weekInfo?.firstDay || 0) % 7;
  } catch {
    return 0;
  }
}

export function get24Hour(displayHour: number, isPm: boolean): number {
  if (isPm) { return displayHour === 12 ? 12 : displayHour + 12; }
  return displayHour === 12 ? 0 : displayHour;
}

export function update12HourState(fullHour: number): { isPm: boolean; displayHour: number } {
  return {
    isPm: fullHour >= 12,
    displayHour: fullHour % 12 || 12
  };
}

export function processDateRanges(ranges: DateRange | null): { [key: string]: [Date, Date] } | null {
  if (!ranges) return null;
  
  return Object.entries(ranges).reduce((acc, [key, dates]) => {
    const start = normalizeDate(dates[0]);
    const end = normalizeDate(dates[1]);
    if (start && end) acc[key] = [start, end];
    return acc;
  }, {} as { [key: string]: [Date, Date] });
}
