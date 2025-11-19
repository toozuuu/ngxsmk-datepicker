import { getStartOfDay, getEndOfDay } from './date.utils';

export type RecurringPattern = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'weekdays'
  | 'weekends'
  | 'custom';

export interface RecurringDateConfig {
  pattern: RecurringPattern;
  startDate: Date;
  endDate?: Date;
  occurrences?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  monthAndDay?: { month: number; day: number };
  interval?: number;
}

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

export function matchesRecurringPattern(date: Date, config: RecurringDateConfig): boolean {
  const generatedDates = generateRecurringDates(config);
  const dateTime = getStartOfDay(date).getTime();
  return generatedDates.some(d => getStartOfDay(d).getTime() === dateTime);
}

