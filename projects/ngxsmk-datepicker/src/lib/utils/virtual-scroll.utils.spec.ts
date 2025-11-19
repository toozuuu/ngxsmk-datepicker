import { calculateVirtualScroll, getVirtualScrollRange, VirtualScrollConfig } from './virtual-scroll.utils';

describe('VirtualScrollUtils', () => {
  describe('calculateVirtualScroll', () => {
    it('should calculate visible items correctly', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const config: VirtualScrollConfig = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 2
      };

      const result = calculateVirtualScroll(items, 0, config);

      expect(result.startIndex).toBeGreaterThanOrEqual(0);
      expect(result.endIndex).toBeLessThan(items.length);
      expect(result.visibleItems.length).toBeGreaterThan(0);
      expect(result.totalHeight).toBe(5000);
    });

    it('should handle scroll position correctly', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const config: VirtualScrollConfig = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 2
      };

      const result = calculateVirtualScroll(items, 1000, config);

      expect(result.startIndex).toBeGreaterThan(0);
      expect(result.offsetY).toBeGreaterThan(0);
    });

    it('should respect overscan', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const config: VirtualScrollConfig = {
        itemHeight: 50,
        containerHeight: 200,
        overscan: 5
      };

      const result = calculateVirtualScroll(items, 0, config);

      expect(result.startIndex).toBe(0);
      expect(result.endIndex).toBeGreaterThan(4);
    });
  });

  describe('getVirtualScrollRange', () => {
    it('should return correct range', () => {
      const result = getVirtualScrollRange(100, 0, 200, 50, 2);

      expect(result.start).toBeGreaterThanOrEqual(0);
      expect(result.end).toBeLessThan(100);
      expect(result.offset).toBeGreaterThanOrEqual(0);
    });

    it('should handle edge cases', () => {
      const result = getVirtualScrollRange(10, 0, 200, 50, 0);

      expect(result.start).toBe(0);
      expect(result.end).toBeLessThan(10);
    });
  });
});

