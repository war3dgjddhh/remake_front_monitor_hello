import { Queue } from './Queue';
export const browerSender = (client, opt) => {
    let sender;
    const taskQue = new Queue(20);
    const ansQue = new Queue(40);
    const dataWrapper = (data, opt) => {
        return Object.assign(Object.assign({}, data), opt);
    };
    if (window.navigator.sendBeacon) {
        sender = (url, _data) => {
            const data = dataWrapper(_data, opt);
            window.navigator.sendBeacon(url, JSON.stringify(data));
        };
    }
    else {
        sender = (url, _data) => {
            const data = dataWrapper(_data, opt);
            const beacon = new Image();
            beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`;
        };
    }
    return {
        beforeInit: () => {
            client.sender.send = (url, data) => {
                const timestamp = Date.now();
                const taskId = timestamp + encodeURI(url);
                if (taskQue.isFull()) {
                    while (!taskQue.isEmpty()) {
                        const { url, data } = taskQue.front();
                        taskQue.pop();
                        sender(url, data);
                    }
                }
                taskQue.push({ url, data, taskId, timestamp });
                ansQue.push({ url, data, taskId, timestamp });
            };
        },
        beforeStart: () => {
            window.setInterval(() => {
            }, (opt === null || opt === void 0 ? void 0 : opt.timeDivide) || 5000);
        }
    };
    // 任务队列 重试机制
};
