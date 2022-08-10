import { getErrorUid } from './../utils/errUtils';
import { Client } from './../client';
import type { Plugin } from './../client';
import { getErrorKey } from '../utils/errUtils';
import { errRecord } from './monitorJsErr';
export const monitorCorsErr = (client: Client): Plugin => {
  const { url = client.opt.url } = {}; // 从配置Map中读取client.opt.geturl("pluginName")
  const handler = (event: ErrorEvent) => {
    // 阻止向上抛出控制台报错
    event.preventDefault();
    // 如果不是跨域脚本异常,就结束
    const mechanism = getErrorKey(event);
    if (mechanism !== 'corsErr') return;
    const exception: errRecord = {
      errUid: getErrorUid(`${mechanism}-${event.message}`),
      category: 'error',
      // 上报错误归类
      mechanism,
      // 错误信息
      errMsg: event.message,
      // 错误类型
      errType: 'CorsError',
      // 错误的标识码
    };
    // 自行上报异常，也可以跨域脚本的异常都不上报;
    client.send(url, exception);
  };
  window.addEventListener('error', (event) => handler(event), true);

  return {
    beforeSend:()=>{
      
    }
  };
};
