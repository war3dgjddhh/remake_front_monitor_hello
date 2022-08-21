import { opt } from '..';
import { Client, Plugin } from '../client';
import { observe, PerformanceEntryHandler } from '../utils/observe';

export type ResourceFlowTiming = {
  name: string;
  duration: number;
  transferSize: number;
  initiatorType: string;
  startTime: number;
  responseEnd: number;
  dnsLookup: number;
  initialConnect: number;
  ssl: number;
  request: number;
  ttfb: number;
  contentDownload: number;
  relativeStartTime: number;
};

export const monitorRes = (client: Client, opt: opt): Plugin => {
  const { url = client.opt.resUrl } = opt;
  const resourceStream: Array<ResourceFlowTiming> = [];
  const monitorRF = () => {
    const entryHandler = (entry: PerformanceResourceTiming) => {
      const {
        name,
        transferSize,
        initiatorType,
        startTime,
        responseEnd,
        domainLookupEnd,
        domainLookupStart,
        connectStart,
        connectEnd,
        secureConnectionStart,
        responseStart,
        requestStart,
        duration,
      } = entry;
      resourceStream.push({
        // name 资源地址
        name,
        duration,
        // transferSize 传输大小
        transferSize,
        // initiatorType 资源类型
        initiatorType,
        // startTime 开始时间  这个是performan.now()的时间开始算, 不是时间戳
        startTime: Date.now(),
        relativeStartTime: startTime,
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
    observe('resource', entryHandler as PerformanceEntryHandler);
  };
  // TODO 等数据上报之后销毁observer
  return {
    beforeInit: () => {
      monitorRF();
      setTimeout(() => {
        client.send(url, {
          data: resourceStream,
          plugin: 'monitorRes',
        } as any);
      }, 6000);
    },
  };
};
