import { Client, Plugin } from './client';
type Ioption = {
  userId: string;
  deviceId: string;
  baseUrl: string;
  // timeDivide: number; // 定时发送数据的间隔 默认5秒
  // timeout: number; // 任务发送, 重试最多时间 默认5秒
};

export const browerSender = (client: Client, opt?: Ioption): Plugin => {
  let sender: Function;
  const BASE_URL = opt?.baseUrl || '';
  const dataWrapper = (data: object, opt?: Ioption) => {
    return {
      ...data,
      ...opt,
    };
  };
  if (window.navigator.sendBeacon) {
    sender = (url: string, _data: object) => {
      const data = dataWrapper(_data, opt);
      window.navigator.sendBeacon(url, JSON.stringify(data));
    };
  } else {
    sender = (url: string, _data: object) => {
      const data = dataWrapper(_data, opt);
      const beacon = new Image();
      beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
    };
  }
  return {
    beforeInit: () => {
      client.sender.send = (url: string, data: object) => {
        sender(BASE_URL + url, data);
      };
    },
  };
  // 任务队列 重试机制
};
