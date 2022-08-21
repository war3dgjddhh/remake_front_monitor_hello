import { opt } from '..';
import { httpRecord } from '../behaviorStore';
import { Client } from './../client';
import type { Plugin } from './../client';
import { getErrorKey, getErrorUid } from '../utils/errUtils';
import { errRecord } from './monitorJsErr';
import { proxyFetch, proxyXmlHttp } from './monitorAPI';
export const monitorHttpErr = (client: Client, opt: opt): Plugin => {
  const { url = client.opt.httpErrUrl } = opt; // 从配置Map中读取client.opt.geturl("pluginName")

  const loadHandler = (metrics: httpRecord) => {
    // 如果 status 状态码小于 400,说明没有 HTTP 请求错误
    if (metrics.status < 400) return;
    const value = metrics.response;
    const mechanism = 'httpErr';
    const exception: errRecord = {
      category: 'error',
      // 上报错误归类
      mechanism,
      // 错误信息
      errMsg: value,
      errUid: getErrorUid(`${mechanism}-${value}-${metrics.statusText}`),
      origin: metrics,
    };
    // 一般错误异常立刻上报，不用缓存在本地
    client.send(url, {
      ...exception,
      plugin: 'monitorHttpErr',
    });
  };

  return {
    beforeInit: () => {
      proxyXmlHttp(null, loadHandler);
      proxyFetch(null, loadHandler);
    },
  };
};
