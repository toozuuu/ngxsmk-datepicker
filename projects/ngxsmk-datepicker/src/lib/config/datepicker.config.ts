import { InjectionToken } from '@angular/core';
import { HolidayProvider } from '../utils/calendar.utils';
import { DateAdapter, NativeDateAdapter } from '../adapters/date-adapter.interface';

/**
 * Global configuration for ngxsmk-datepicker components
 */
export interface DatepickerConfig {
  /**
   * First day of the week (0 = Sunday, 1 = Monday, etc.)
   * If null, will be auto-detected from locale
   */
  weekStart?: number | null;

  /**
   * Minute interval for time selection (1, 5, 15, 30, etc.)
   * Default: 1
   */
  minuteInterval?: number;

  /**
   * Global holiday provider for all datepicker instances
   */
  holidayProvider?: HolidayProvider | null;

  /**
   * Default year range for year selection dropdown
   * Default: 10
   */
  yearRange?: number;

  /**
   * Default locale for date formatting
   * If not provided, will use browser locale or 'en-US'
   */
  locale?: string;

  /**
   * Default timezone for date formatting (IANA timezone name, e.g., 'America/New_York', 'UTC', 'Europe/London')
   * If not provided, dates will be formatted in the user's local timezone
   * 
   * Note: JavaScript Date objects are always stored in UTC internally.
   * This setting only affects how dates are displayed/formatted, not how they are stored.
   */
  timezone?: string;

  /**
   * Global minimum date for all datepicker instances
   * Dates before this will be disabled
   */
  minDate?: Date | string | null;

  /**
   * Global maximum date for all datepicker instances
   * Dates after this will be disabled
   */
  maxDate?: Date | string | null;

  /**
   * Optional date adapter for custom date formatting/parsing
   * Supports date-fns, dayjs, Luxon, or custom implementations
   * Default: NativeDateAdapter (uses native JavaScript Date)
   */
  dateAdapter?: DateAdapter;
}

/**
 * Injection token for DatepickerConfig
 */
export const DATEPICKER_CONFIG = new InjectionToken<DatepickerConfig>('DATEPICKER_CONFIG');

/**
 * Default configuration values
 */
export const DEFAULT_DATEPICKER_CONFIG: DatepickerConfig = {
  weekStart: null,
  minuteInterval: 1,
  holidayProvider: null,
  yearRange: 10,
  dateAdapter: new NativeDateAdapter(),
};

/**
 * Provider function to configure global datepicker defaults
 * 
 * @example
 * ```typescript
 * import { provideDatepickerConfig } from 'ngxsmk-datepicker';
 * 
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideDatepickerConfig({
 *       weekStart: 1, // Monday
 *       minuteInterval: 15,
 *       yearRange: 20,
 *       holidayProvider: myHolidayProvider
 *     })
 *   ]
 * });
 * ```
 */
export function provideDatepickerConfig(config: DatepickerConfig) {
  return {
    provide: DATEPICKER_CONFIG,
    useValue: { ...DEFAULT_DATEPICKER_CONFIG, ...config }
  };
}

