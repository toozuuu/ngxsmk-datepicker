import { getStartOfDay, getEndOfDay, addMonths, subtractDays, getStartOfMonth, getEndOfMonth, isSameDay, normalizeDate, DateInput } from './date.utils';

describe('Date Utils', () => {
  describe('getStartOfDay', () => {
    it('should return date with time set to 00:00:00.000', () => {
      const date = new Date(2025, 5, 15, 14, 30, 45, 123);
      const result = getStartOfDay(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should handle edge case of midnight', () => {
      const date = new Date(2025, 5, 15, 0, 0, 0, 0);
      const result = getStartOfDay(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('getEndOfDay', () => {
    it('should return date with time set to 23:59:59.999', () => {
      const date = new Date(2025, 5, 15, 14, 30, 45, 123);
      const result = getEndOfDay(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date(2025, 5, 15);
      const result = addMonths(date, 2);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(7);
      expect(result.getDate()).toBe(15);
    });

    it('should handle year rollover', () => {
      const date = new Date(2025, 11, 15);
      const result = addMonths(date, 2);
      
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
    });

    it('should handle negative months', () => {
      const date = new Date(2025, 5, 15);
      const result = addMonths(date, -2);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(3);
    });
  });

  describe('subtractDays', () => {
    it('should subtract days correctly', () => {
      const date = new Date(2025, 5, 15);
      const result = subtractDays(date, 5);
      
      expect(result.getDate()).toBe(10);
    });

    it('should handle month rollover', () => {
      const date = new Date(2025, 5, 3);
      const result = subtractDays(date, 5);
      
      expect(result.getMonth()).toBe(4);
      expect(result.getDate()).toBe(29);
    });
  });

  describe('getStartOfMonth', () => {
    it('should return first day of month', () => {
      const date = new Date(2025, 5, 15);
      const result = getStartOfMonth(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfMonth', () => {
    it('should return last day of month', () => {
      const date = new Date(2025, 5, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(30);
    });

    it('should handle February in leap year', () => {
      const date = new Date(2024, 1, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getDate()).toBe(29);
    });

    it('should handle February in non-leap year', () => {
      const date = new Date(2025, 1, 15);
      const result = getEndOfMonth(date);
      
      expect(result.getDate()).toBe(28);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2025, 5, 15, 10, 30);
      const date2 = new Date(2025, 5, 15, 14, 45);
      
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2025, 5, 15);
      const date2 = new Date(2025, 5, 16);
      
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for null dates', () => {
      expect(isSameDay(null, new Date())).toBe(false);
      expect(isSameDay(new Date(), null)).toBe(false);
      expect(isSameDay(null, null)).toBe(false);
    });
  });

  describe('normalizeDate', () => {
    it('should return Date object as is', () => {
      const date = new Date(2025, 5, 15);
      const result = normalizeDate(date);
      
      expect(result).toEqual(date);
    });

    it('should parse string date', () => {
      const dateString = '2025-06-15';
      const result = normalizeDate(dateString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result!.getFullYear()).toBe(2025);
    });

    it('should return null for null input', () => {
      expect(normalizeDate(null)).toBeNull();
    });

    it('should handle invalid date strings', () => {
      const result = normalizeDate('invalid-date');
      expect(result).toBeNull();
    });
  });
});

