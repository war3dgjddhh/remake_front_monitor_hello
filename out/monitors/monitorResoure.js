import { observe } from "../utils/observe";
export const resourceMonitor = (client, opt) => {
    const resourceStream = [];
    const monitorRF = () => {
        const entryHandler = (entry) => {
            const { name, transferSize, initiatorType, startTime, responseEnd, domainLookupEnd, domainLookupStart, connectStart, connectEnd, secureConnectionStart, responseStart, requestStart, } = entry;
            resourceStream.push({
                // name 资源地址
                name,
                // transferSize 传输大小
                transferSize,
                // initiatorType 资源类型
                initiatorType,
                // startTime 开始时间
                startTime,
                // responseEnd 结束时间
                responseEnd,
                // 贴近 Chrome 的近似分析方案，受到跨域资源影响
                dnsLookup: domainLookupEnd - domainLookupStart,
                initialConnect: connectEnd - connectStart,
                ssl: connectEnd - secureConnectionStart,
                request: responseStart - requestStart,
                ttfb: responseStart - requestStart,
                contentDownload: responseStart - requestStart,
            });
        };
        observe('resource', entryHandler);
    };
    return {
        beforeInit: () => {
            monitorRF();
        },
        beforeStart: () => {
            setTimeout(() => {
                client.send('url', resourceStream);
            }, 10000);
        },
        beforeDestory: () => {
            // 释放obsever
        },
    };
};
