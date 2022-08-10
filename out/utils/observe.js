export const observe = (type, callback) => {
    var _a;
    // 类型合规，就返回 observe
    if ((_a = PerformanceObserver.supportedEntryTypes) === null || _a === void 0 ? void 0 : _a.includes(type)) {
        const ob = new PerformanceObserver((l) => l.getEntries().map(callback));
        ob.observe({ type, buffered: true });
        return ob;
    }
    return undefined;
};
