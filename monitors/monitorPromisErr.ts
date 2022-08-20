import { Client } from './../client';
import type { Plugin } from './../client';
import { getErrorKey, getErrorUid } from '../utils/errUtils';
import { errRecord } from './monitorJsErr';
export const monitorPromisErr = (client: Client): Plugin => {
  const { url = client.opt.url } = {}; // 从配置Map中读取client.opt.geturl("pluginName")
  const promiseErrHandler = (event: PromiseRejectionEvent) => {
    event.preventDefault(); // 阻止向上抛出控制台报错
    const value = event.reason.message || event.reason;
    const type = event.reason.name || 'UnKnowun';
    const mechanism = 'unhandledrejection';
    const exception: errRecord = {
      category: 'error',
      mechanism,
      errMsg: value,
      errType: type,
      errUid: getErrorUid(`${mechanism}-${value}-${type}`),
    };
    // 一般错误异常立刻上报，不用缓存在本地
    client.send(url, exception);
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => promiseErrHandler(event),
    true
  );
  return {};
};
