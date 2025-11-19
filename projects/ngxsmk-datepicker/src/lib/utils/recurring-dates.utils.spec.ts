import { generateRecurringDates, matchesRecurringPattern, RecurringDateConfig } from './recurring-dates.utils';
import { getStartOfDay } from './date.utils';

describe('Recurring Dates Utils', () => {
  describe('generateRecurringDates', () => {
    it('should generate daily dates', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'daily',
        startDate: startDate,
        interval: 1,
        occurrences: 5
      });

      expect(dates.length).toBe(5);
      expect(dates[0].getTime()).toBe(startDate.getTime());
    });

    it('should generate weekly dates', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'weekly',
        startDate: startDate,
        dayOfWeek: 1,
        interval: 1,
        occurrences: 4
      });

      expect(dates.length).toBe(4);
      dates.forEach(date => {
        expect(date.getDay()).toBe(1);
      });
    });

    it('should generate monthly dates', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 15));
      const dates = generateRecurringDates({
        pattern: 'monthly',
        startDate: startDate,
        dayOfMonth: 15,
        interval: 1,
        occurrences: 6
      });

      expect(dates.length).toBe(6);
      dates.forEach(date => {
        expect(date.getDate()).toBe(15);
      });
    });

    it('should generate yearly dates', () => {
      const startDate = getStartOfDay(new Date(2025, 5, 15));
      const dates = generateRecurringDates({
        pattern: 'yearly',
        startDate: startDate,
        monthAndDay: { month: 5, day: 15 },
        interval: 1,
        occurrences: 3
      });

      expect(dates.length).toBe(3);
      dates.forEach(date => {
        expect(date.getMonth()).toBe(5);
        expect(date.getDate()).toBe(15);
      });
    });

    it('should generate weekdays dates', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'weekdays',
        startDate: startDate,
        interval: 1,
        occurrences: 10
      });

      expect(dates.length).toBeGreaterThan(0);
      dates.forEach(date => {
        const dayOfWeek = date.getDay();
        expect(dayOfWeek).toBeGreaterThanOrEqual(1);
        expect(dayOfWeek).toBeLessThanOrEqual(5);
      });
    });

    it('should generate weekends dates', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'weekends',
        startDate: startDate,
        interval: 1,
        occurrences: 10
      });

      expect(dates.length).toBeGreaterThan(0);
      dates.forEach(date => {
        const dayOfWeek = date.getDay();
        expect(dayOfWeek === 0 || dayOfWeek === 6).toBe(true);
      });
    });

    it('should respect endDate', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const endDate = getStartOfDay(new Date(2025, 0, 10));
      const dates = generateRecurringDates({
        pattern: 'daily',
        startDate: startDate,
        endDate: endDate,
        interval: 1
      });

      expect(dates.length).toBeLessThanOrEqual(10);
      dates.forEach(date => {
        expect(date.getTime()).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    it('should handle interval greater than 1', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const dates = generateRecurringDates({
        pattern: 'daily',
        startDate: startDate,
        interval: 2,
        occurrences: 5
      });

      expect(dates.length).toBe(5);
      expect(dates[1].getDate() - dates[0].getDate()).toBe(2);
    });
  });

  describe('matchesRecurringPattern', () => {
    it('should match date in recurring pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const testDate = getStartOfDay(new Date(2025, 0, 6));
      const config: RecurringDateConfig = {
        pattern: 'weekly',
        startDate: startDate,
        dayOfWeek: 1,
        interval: 1
      };

      const matches = matchesRecurringPattern(testDate, config);
      expect(matches).toBe(true);
    });

    it('should not match date outside pattern', () => {
      const startDate = getStartOfDay(new Date(2025, 0, 1));
      const testDate = getStartOfDay(new Date(2025, 0, 2));
      const config: RecurringDateConfig = {
        pattern: 'weekly',
        startDate: startDate,
        dayOfWeek: 1,
        interval: 1
      };

      const matches = matchesRecurringPattern(testDate, config);
      expect(matches).toBe(false);
    });
  });
});

