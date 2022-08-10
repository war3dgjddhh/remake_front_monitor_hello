import { opt } from "..";
import { Client, Plugin } from "../client";
import { observe, PerformanceEntryHandler } from "../utils/observe";

export type ResourceFlowTiming = {
  name: string;
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
}

export const resourceMonitor = (client: Client, opt: opt): Plugin => {
  const resourceStream: Array<ResourceFlowTiming> = []
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
      } = entry;
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
    observe('resource', entryHandler as PerformanceEntryHandler);
  }
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
