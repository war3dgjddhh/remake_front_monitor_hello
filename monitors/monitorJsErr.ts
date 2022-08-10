import { PageInfo } from './../utils/getPageInfo';
import { Client, category } from './../client';
import type { Plugin } from './../client';
import { getErrorKey, getErrorUid } from '../utils/errUtils';
import { behaviorStack } from '../behaviorStore';
export type errRecord = {
  category: category;
  mechanism: string;
  errMsg?: string;
  errType: string;
  errUid: string;
  stackTrace?: object;
  pageInfo?: PageInfo;
  breadcrumbs?: Array<behaviorStack>;
}
export const monitorJsErr = (client: Client): Plugin => {
  const {url = client.opt.url} = {}// 从配置Map中读取client.opt.geturl("pluginName")
  const JsErrHandler = (event: ErrorEvent) => {
    // 阻止向上抛出控制台报错
    event.preventDefault();
    const mechanism = getErrorKey(event);
    if (mechanism !== 'jsErr') return;
    const exception: errRecord = {
      category:'error',
      mechanism,
      errMsg: event.message,
      errType: (event.error && event.error.name) || 'UnKnowun',
      errUid: getErrorUid(
        `${mechanism}-${event.message}-${event.filename}`
      ),
    };
    client.send(url, exception);
  };
  window.addEventListener('error', (e) => JsErrHandler(e), true);
  return {
  };
};
