/**
 * Performance utilities for ngxsmk-datepicker
 * Optimized for better runtime performance
 */

/**
 * Memoization decorator for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      window.setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a shallow comparison function for objects
 */
export function shallowEqual<T extends Record<string, any>>(a: T, b: T): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Optimized date comparison for calendar rendering
 */
export function createDateComparator() {
  const cache = new Map<string, boolean>();
  const MAX_CACHE_SIZE = 1000; // Prevent memory leaks
  
  return (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return date1 === date2;
    
    const key = `${date1.getTime()}-${date2.getTime()}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
    
    // Prevent cache from growing too large
    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    cache.set(key, result);
    return result;
  };
}

/**
 * Optimized array filtering with caching
 */
export function createFilteredArray<T>(
  source: T[],
  filterFn: (item: T) => boolean,
  cacheKey?: string
): T[] {
  const cache = new Map<string, T[]>();
  const key = cacheKey || JSON.stringify(source);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = source.filter(filterFn);
  cache.set(key, result);
  return result;
}

/**
 * Clear all caches to prevent memory leaks
 */
export function clearAllCaches(): void {
  // This would be called from the component's ngOnDestroy
  // Implementation depends on how caches are managed globally
}


