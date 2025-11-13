import { getStartOfDay, getEndOfDay } from './date.utils';

/**
 * Recurring date pattern types
 */
export type RecurringPattern = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'weekdays'
  | 'weekends'
  | 'custom';

/**
 * Configuration for recurring date selection
 */
export interface RecurringDateConfig {
  /**
   * Pattern type
   */
  pattern: RecurringPattern;
  
  /**
   * Start date for the recurring pattern
   */
  startDate: Date;
  
  /**
   * End date for the recurring pattern (optional)
   */
  endDate?: Date;
  
  /**
   * Number of occurrences (optional, used if endDate is not provided)
   */
  occurrences?: number;
  
  /**
   * For weekly pattern: day of week (0=Sunday, 1=Monday, etc.)
   * For monthly pattern: day of month (1-31)
   * For yearly pattern: month and day (e.g., { month: 0, day: 1 } for January 1)
   */
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthAndDay?: { month: number; day: number };
  
  /**
   * Interval for pattern (e.g., every 2 weeks, every 3 months)
   * Default: 1
   */
  interval?: number;
}

/**
 * Generate dates based on a recurring pattern
 */
export function generateRecurringDates(config: RecurringDateConfig): Date[] {
  const dates: Date[] = [];
  const interval = config.interval || 1;
  const startDate = getStartOfDay(config.startDate);
  const endDate = config.endDate ? getEndOfDay(config.endDate) : null;
  
  const currentDate = new Date(startDate);
  let count = 0;
  const maxOccurrences = config.occurrences || (endDate ? 365 : 10);
  
  switch (config.pattern) {
    case 'daily': {
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + interval);
        count++;
      }
      break;
    }
      
    case 'weekly': {
      if (config.dayOfWeek === undefined) {
        const targetDay = startDate.getDay();
        while (count < maxOccurrences) {
          if (endDate && currentDate > endDate) break;
          const dayOfWeek = currentDate.getDay();
          const daysUntilTarget = (targetDay - dayOfWeek + 7) % 7;
          if (daysUntilTarget === 0 && count === 0) {
            dates.push(new Date(currentDate));
            count++;
            currentDate.setDate(currentDate.getDate() + (7 * interval));
          } else {
            currentDate.setDate(currentDate.getDate() + daysUntilTarget);
            dates.push(new Date(currentDate));
            count++;
            currentDate.setDate(currentDate.getDate() + (7 * interval));
          }
        }
      } else {
        while (count < maxOccurrences) {
          if (endDate && currentDate > endDate) break;
          const dayOfWeek = currentDate.getDay();
          const daysUntilTarget = (config.dayOfWeek - dayOfWeek + 7) % 7;
          if (daysUntilTarget === 0 && count === 0) {
            dates.push(new Date(currentDate));
            count++;
            currentDate.setDate(currentDate.getDate() + (7 * interval));
          } else {
            currentDate.setDate(currentDate.getDate() + daysUntilTarget);
            dates.push(new Date(currentDate));
            count++;
            currentDate.setDate(currentDate.getDate() + (7 * interval));
          }
        }
      }
      break;
    }
      
    case 'monthly': {
      const targetDay = config.dayOfMonth || startDate.getDate();
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const dayToSet = Math.min(targetDay, lastDayOfMonth);
        currentDate.setDate(dayToSet);
        dates.push(new Date(currentDate));
        count++;
        currentDate.setMonth(currentDate.getMonth() + interval);
      }
      break;
    }
      
    case 'yearly': {
      const monthDay = config.monthAndDay || { month: startDate.getMonth(), day: startDate.getDate() };
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        currentDate.setMonth(monthDay.month);
        currentDate.setDate(monthDay.day);
        dates.push(new Date(currentDate));
        count++;
        currentDate.setFullYear(currentDate.getFullYear() + interval);
      }
      break;
    }
      
    case 'weekdays':
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          dates.push(new Date(currentDate));
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
      
    case 'weekends':
      while (count < maxOccurrences) {
        if (endDate && currentDate > endDate) break;
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          dates.push(new Date(currentDate));
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
      
    default:
      break;
  }
  
  return dates;
}

/**
 * Check if a date matches a recurring pattern
 */
export function matchesRecurringPattern(date: Date, config: RecurringDateConfig): boolean {
  const generatedDates = generateRecurringDates(config);
  const dateTime = getStartOfDay(date).getTime();
  return generatedDates.some(d => getStartOfDay(d).getTime() === dateTime);
}

