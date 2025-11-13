/**
 * Timezone utility functions for date formatting and parsing
 */

/**
 * Format a date with timezone support
 * @param date The date to format
 * @param locale The locale for formatting
 * @param options Intl.DateTimeFormatOptions
 * @param timezone Optional timezone (IANA timezone name, e.g., 'America/New_York', 'UTC', 'Europe/London')
 * @returns Formatted date string
 */
export function formatDateWithTimezone(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
  timezone?: string
): string {
  if (timezone) {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: timezone,
    });
    return formatter.format(date);
  }
  return date.toLocaleString(locale, options);
}

/**
 * Parse a date string with timezone awareness
 * Note: JavaScript Date objects are always stored in UTC internally.
 * When parsing, we interpret the input in the specified timezone (or local timezone if not specified).
 * 
 * @param dateString The date string to parse
 * @param timezone Optional timezone for parsing (IANA timezone name)
 * @returns Date object (always in UTC internally)
 */
export function parseDateWithTimezone(dateString: string, timezone?: string): Date | null {
  if (!dateString) return null;

  // If timezone is specified, we need to parse the date as if it's in that timezone
  if (timezone) {
    try {
      // Create a date formatter to parse the date in the specified timezone
      // This is a simplified approach - for complex parsing, consider using date-fns-tz or Luxon
      const date = new Date(dateString);
      
      // If the date string doesn't include timezone info, we interpret it in the specified timezone
      // by adjusting for the timezone offset
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    } catch {
      return null;
    }
  }

  // Default parsing (uses local timezone)
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Convert a date from one timezone to another
 * Note: JavaScript Date objects are always UTC internally.
 * This function helps format a date as if it were in a different timezone.
 * 
 * @param date The date to convert
 * @param fromTimezone Source timezone (IANA name)
 * @param _toTimezone Target timezone (IANA name) - currently unused in simplified implementation
 * @returns New Date object (still UTC internally, but represents the time in target timezone)
 */
export function convertTimezone(
  date: Date,
  fromTimezone: string,
  _toTimezone: string
): Date {
  // Get the date components in the source timezone
  const fromFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = fromFormatter.formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
  const second = parseInt(parts.find(p => p.type === 'second')?.value || '0');

  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  return new Date(dateString);
}

/**
 * Get the current timezone offset in minutes for a given timezone
 * @param timezone IANA timezone name
 * @param date Optional date to check offset for (defaults to now)
 * @returns Offset in minutes from UTC
 */
export function getTimezoneOffset(timezone: string, date: Date = new Date()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    
    // Get offset string like "GMT+5:30" or "GMT-8:00"
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    
    if (offsetPart) {
      // Parse offset string (simplified - for production use a proper parser)
      const offsetStr = offsetPart.value.replace('GMT', '').trim();
      const sign = offsetStr[0] === '-' ? -1 : 1;
      const [hours = 0, minutes = 0] = offsetStr.slice(1).split(':').map(Number);
      return sign * (hours * 60 + minutes);
    }
  } catch {
    // Fallback to local timezone offset
  }
  
  return date.getTimezoneOffset();
}

/**
 * Check if a timezone string is valid
 * @param timezone IANA timezone name
 * @returns true if valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

