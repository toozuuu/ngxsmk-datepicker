/**
 * Utilities entry point
 * 
 * Import utilities separately for better tree-shaking:
 * 
 * @example
 * ```typescript
 * import { getStartOfDay, normalizeDate } from 'ngxsmk-datepicker/utils';
 * import { formatDateWithTimezone } from 'ngxsmk-datepicker/utils';
 * ```
 */

export {
  getStartOfDay,
  getEndOfDay,
  addMonths,
  subtractDays,
  getStartOfMonth,
  getEndOfMonth,
  isSameDay,
  normalizeDate,
  type DateInput,
} from './lib/utils/date.utils';

export {
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
  type HolidayProvider,
  type DateRange,
  type DatepickerValue,
} from './lib/utils/calendar.utils';

export {
  exportToJson,
  importFromJson,
  exportToCsv,
  importFromCsv,
  exportToIcs,
  importFromIcs,
  type ExportOptions,
} from './lib/utils/export-import.utils';

export {
  formatDateWithTimezone,
  parseDateWithTimezone,
  convertTimezone,
  getTimezoneOffset,
  isValidTimezone,
} from './lib/utils/timezone.utils';

export {
  memoize,
  debounce,
  throttle,
  shallowEqual,
  createDateComparator,
  createFilteredArray,
  clearAllCaches,
} from './lib/utils/performance.utils';

export {
  generateRecurringDates,
  matchesRecurringPattern,
  type RecurringPattern,
  type RecurringDateConfig,
} from './lib/utils/recurring-dates.utils';

