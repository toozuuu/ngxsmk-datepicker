export interface VirtualScrollItem {
  index: number;
  data: unknown;
}

export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: VirtualScrollItem[];
  totalHeight: number;
  offsetY: number;
}

export function calculateVirtualScroll(
  items: unknown[],
  scrollTop: number,
  config: VirtualScrollConfig
): VirtualScrollResult {
  const { itemHeight, containerHeight, overscan = 3 } = config;
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
  
  const visibleItems: VirtualScrollItem[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      data: items[i]
    });
  }
  
  const offsetY = startIndex * itemHeight;
  
  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY
  };
}

export function getVirtualScrollRange(
  totalItems: number,
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  overscan: number = 3
): { start: number; end: number; offset: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems - 1, start + visibleCount + overscan * 2);
  const offset = start * itemHeight;
  
  return { start, end, offset };
}

