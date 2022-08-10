import { opt } from '..';
import { Client, Plugin } from '../client';
import type { httpRecord } from '../behaviorStore';
// 调用 proxyXmlHttp 即可完成全局监听 XMLHttpRequest
// 调用 proxyXmlHttp 即可完成全局监听 XMLHttpRequest
export const proxyXmlHttp = (
  sendHandler: Function | null | undefined,
  loadHandler: Function
) => {
  if (
    'XMLHttpRequest' in window &&
    typeof window.XMLHttpRequest === 'function'
  ) {
    const oXMLHttpRequest = window.XMLHttpRequest;
    if (!(window as any).oXMLHttpRequest) {
      // oXMLHttpRequest 为原生的 XMLHttpRequest，可以用以 SDK 进行数据上报，区分业务
      (window as any).oXMLHttpRequest = oXMLHttpRequest;
    }
    const { open, send } = window.XMLHttpRequest.prototype;
    let metrics_method = new Map();
    window.XMLHttpRequest.prototype.open = function pyopen(...rest: any[]) {
      // 可以放一些请求头,  我也不知道这个能干啥
      metrics_method.set(rest[1], rest[0]);
      return open.call(this, rest[0], rest[1], rest[2], rest[3], rest[4]);
    };
    window.XMLHttpRequest.prototype.send = function pysend(body) {
      this.addEventListener('loadend', () => {
        const { responseURL, status, statusText, response } = this;
        console.log(metrics_method);
        const regx = /ht\w+:\/\/.+?\//;
        const url = (responseURL as string).replace(regx, '/');
        let metrics = {
          method:
            metrics_method.get(url) || '',
          body: body || '',
          url,
          status,
          statusText,
          response,
          responseTime: Date.now(),
        } as httpRecord;
        if (typeof loadHandler === 'function') loadHandler(metrics);
        // xhr.status 状态码
      });
      // sendHandler 可以在发送 Ajax 请求之前，挂载一些信息，比如 header 请求头
      // setRequestHeader 设置请求header，用来传输关键参数等
      // xhr.setRequestHeader('xxx-id', 'VQVE-QEBQ');
      if (typeof sendHandler === 'function') sendHandler(body);
      return send.call(this, ...arguments);
    };
  }
};
// 调用 proxyFetch 即可完成全局监听 fetch
export const proxyFetch = (
  sendHandler: Function | null | undefined,
  loadHandler: Function
) => {
  if ('fetch' in window && typeof window.fetch === 'function') {
    const oFetch = window.fetch;
    if (!(window as any).oFetch) {
      (window as any).oFetch = oFetch;
    }
    (window as any).fetch = async (input: any, init: RequestInit) => {
      // init 是用户手动传入的 fetch 请求互数据，包括了 method、body、headers，要做统一拦截数据修改，直接改init即可
      if (typeof sendHandler === 'function') sendHandler(init);
      let metrics = {} as httpRecord;

      metrics.method = init?.method || '';
      metrics.url =
        (input && typeof input !== 'string' ? input?.url : input) || ''; // 请求的url
      metrics.body = init?.body || '';
      metrics.requestTime = new Date().getTime();

      return oFetch.call(window, input, init).then(async (response) => {
        // clone 出一个新的 response,再用其做.text(),避免 body stream already read 问题
        const res = response.clone();
        metrics = {
          ...metrics,
          status: res.status,
          statusText: res.statusText,
          response: await res.text(),
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandler === 'function') loadHandler(metrics);
        return response;
      });
    };
  }
};
export const monitorAPI = (client: Client, option: opt): Plugin => {
  const { url = client.opt.url } = option;
  // sendhander ；用于在请求前加上信息
  const loadHandler = (metrics: httpRecord) => {
    if (metrics.status < 400) {
      // 对于正常请求的 HTTP 请求来说,不需要记录 请求体 和 响应体
      delete metrics.response;
      delete metrics.body;
    }
    metrics.timestamp = Date.now();
    // 正常得用户请求也得上报
    client.send(url, metrics);
    //记录到用户行为记录栈
    client.breadcrumbs.push(metrics);
  };

  return {
    beforeInit: () => {
      proxyFetch(null, loadHandler);
      proxyXmlHttp(null, loadHandler);
    },
  };
};
