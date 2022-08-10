import { Client, Plugin } from './client';
import { Queue } from './Queue';
type Ioption = {
  userId: string;
  deviceId: string;
  timeDivide: number; // 定时发送数据的间隔 默认5秒
  timeout: number; // 任务发送, 重试最多时间 默认5秒
};
type Itask = {
  url: string;
  data: object;
  taskId: string;
  timestamp: number;
};
export const browerSender = (client: Client, opt?: Ioption): Plugin => {
  let sender: Function;
  const taskQue = new Queue<Itask>(20);
  const ansQue = new Queue<Itask>(40);
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
        const timestamp = Date.now();
        const taskId = timestamp + encodeURI(url);
        if (taskQue.isFull()) {
          while (!taskQue.isEmpty()) {
            const { url, data } = taskQue.front() as Itask;
            taskQue.pop();
            sender(url, data);
          }
        }
        taskQue.push({ url, data, taskId, timestamp });
        ansQue.push({ url, data, taskId, timestamp });
      };
    },
    beforeStart:()=>{
      window.setInterval(() => {
        
      },opt?.timeDivide || 5000)
    }
  };
  // 任务队列 重试机制
};
