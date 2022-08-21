import { Plugin, category } from './../client';
import { opt } from '..';
import { getErrorUid } from '../utils/errUtils';
import { Client } from '../client';
import { getErrorKey } from '../utils/errUtils';
export type resErr = {
  errorUid: string;
  src: string;
  html: any;
  type: string;
  plugin: string;
  category: 'error';
};
export const monitorResErr = (client: Client, opt: opt): Plugin => {
  const handler = (event: Event) => {
    const { url = client.opt.resErrUrl } = opt;
    event.preventDefault(); // 阻止向上抛出控制台报错
    if (getErrorKey(event) !== 'resErr') return;
    const target = event.target as any;
    const exception: resErr = {
      errorUid: getErrorUid(`resErr-${target.src}-${target.tagName}`),
      src: target.src,
      html: target.outerHTML,
      type: target.tagName,
      plugin: 'monitorResErr',
      category: 'error',
    };
    // 一般错误异常立刻上报，不用缓存在本地
    client.send(url, exception);
  };

  return {
    beforeInit: () => {
      window.addEventListener('error', (event) => handler(event), true);
    },
  };
};
