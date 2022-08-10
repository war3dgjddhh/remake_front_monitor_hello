export interface PerformanceEntryHandler {
  (entry: PerformanceEntry): void;
}

export const observe = (
  type: string,
  callback: PerformanceEntryHandler
): PerformanceObserver | undefined => {
  // 类型合规，就返回 observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob: PerformanceObserver = new PerformanceObserver((l) =>
      l.getEntries().map(callback)
    );

    ob.observe({ type, buffered: true });
    return ob;
  }
  return undefined;
};
