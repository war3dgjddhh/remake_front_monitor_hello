import { opt } from '..';
import { Client, Plugin } from '../client';
export type routeRecord = {
  jumpType: string;
  timestamp: number;
  routePath: string;
};
export type PV = {
  routePath: string;
  duration: number;
  startTime: number;
  endTime?: number;
};
const history = window.history;
export const monitorPV = (client: Client, opt: opt): Plugin => {
  const { url = client.opt.url } = opt;
  const wr = (type: keyof History) => {
    const orig: Function = history[type];
    return function (this: unknown) {
      const rv = orig.apply(this, arguments);
      const e = new Event(type);
      window.dispatchEvent(e);
      return rv;
    };
  };
  // 添加 pushState replaceState 事件
  const wrHistory = (): void => {
    history.pushState = wr('pushState');
    history.replaceState = wr('replaceState');
  };
  // 为 pushState 以及 replaceState 方法添加 Event 事件
  const proxyHistory = (handler: Function): void => {
    // 添加对 replaceState 的监听
    window.addEventListener('replaceState', (e) => handler(e), true);
    // 添加对 pushState 的监听
    // window.addEventListener('pushState', (e) => handler(e), true);
  };
  const proxyHash = (handler: Function): void => {
    // 添加对 hashchange 的监听
    // hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
    // 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
    // window.addEventListener('hashchange', (e) => handler(e), true);
    // 添加对 popstate 的监听
    // 浏览器回退、前进行为触发的 可以自己判断是否要添加监听
    window.addEventListener('popstate', (e) => handler(e), true);
  };
  // 监听路由变化
  const pv: Array<PV> = [];

  // 处理用户进来的时候的路由状态改变, 和关闭浏览器时,最后一个页面的停留时间
  const edgeResolve = () => {
    window.addEventListener('load', () => {
      pv.push({
        routePath: window.location.pathname,
        startTime: Date.now(),
        duration: 0,
        endTime: 0,
      });
    });
    // 这个时候应该只有一个, 在监听路由改变的时候每次加入一个然后shift一个
    window.addEventListener('beforeunload', () => {
      pv[0].endTime = Date.now();
      pv[0].duration = pv[0].endTime - pv[0].startTime;
      send(url, pv.shift()!);
    });
  };

  const routeChangeHandler = (e: Event) => {
    const { pathname = '' } = window.location;
    const routeRecord: routeRecord = {
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

    if (pv.length >= 2) {
      pv[pv.length - 2].endTime = cur.startTime;
      pv[pv.length - 2].duration = cur.startTime - pv[pv.length - 2].startTime;
    }
    client.breadcrumbs.push(routeRecord);
    send(url, pv.shift()!);
  };
  function send(url: string, data: object) {
    client.send(url, { ...data, plugin: 'monitorPV' });
  }
  return {
    beforeInit: () => {
      wrHistory();
      proxyHistory(routeChangeHandler);
      proxyHash(routeChangeHandler);
      edgeResolve();
    },
    beforeSend: (url, data) => {
      // console.log(data);
    },
  };
};
