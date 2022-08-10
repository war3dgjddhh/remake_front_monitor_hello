export const wr = (type) => {
    const orig = history[type];
    return function () {
        console.log(this);
        console.log('arguments', arguments);
        orig.apply(this, arguments);
    };
};
const monitorRouteChange = (client) => {
    // 添加 pushState replaceState 事件
    const wrHistory = () => {
        history.pushState = wr('pushState');
        history.replaceState = wr('replaceState');
    };
    // 为 pushState 以及 replaceState 方法添加 Event 事件
    const proxyHistory = (handler) => {
        // 添加对 replaceState 的监听
        window.addEventListener('replaceState', (e) => handler(e), true);
        // 添加对 pushState 的监听
        window.addEventListener('pushState', (e) => handler(e), true);
    };
    const proxyHash = (handler) => {
        // 添加对 hashchange 的监听
        // hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
        // 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
        window.addEventListener('hashchange', (e) => handler(e), true);
        // 添加对 popstate 的监听
        // 浏览器回退、前进行为触发的 可以自己判断是否要添加监听
        window.addEventListener('popstate', (e) => handler(e), true);
    };
    // 监听路由变化
    const pv = [];
    const routeChangeHandler = (e) => {
        const { pathname = '' } = window.location;
        const routeRecord = {
            jumpType: e.type,
            timestamp: Date.now(),
            routePath: pathname,
        };
        const cur = {
            startTime: Date.now(),
            duration: 0,
            routePath: pathname,
        };
        pv.push(cur);
        pv[pv.length - 1].endTime = cur.startTime;
        pv[pv.length - 1].duration = cur.startTime - pv[pv.length - 1].startTime;
        if (pv.length >= 2) {
            client.send('', pv.shift());
        }
        client.breadcrumbs.push(routeRecord);
    };
    return {
        beforeInit: () => {
            wrHistory();
            proxyHistory(routeChangeHandler);
            proxyHash(routeChangeHandler);
        },
    };
};
