// TODO: FMP
import { observe, PerformanceEntryHandler } from '../utils/observe.js';
import { Client, Plugin } from '../client';
import { afterLoad } from '../utils/afterLoad.js';
type Ioption = {
  monitorningCLS: boolean;
};
export type MeNavigationTiming = {
  FP?: number;
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirstByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number;
  DomParse?: number;
  Res?: number;
};
export type webVitalData = {
  CLS: number;
  FCP: number;
  FID: number;
  LCP: number;
} & MeNavigationTiming;
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
const webVitalData: webVitalData = {
  CLS: -1,
  FCP: -1,
  FID: -1,
  LCP: -1,
};
export const monitorWebPref = (client: Client, opt: Ioption): Plugin => {
  const monitorCLS = () => {
    let sessionValue = 0;
    let sessionEntries: PerformanceEntry[] = [];
    const entryHandler = (entry: LayoutShift) => {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }
        if (sessionValue > webVitalData.CLS) {
          webVitalData.CLS = sessionValue;
        }
      }
    };
    observe('layout-shift', entryHandler as PerformanceEntryHandler);
  };
  const monitorFCP = afterLoad(() => {
    const [entry] = performance.getEntriesByName('first-contentful-paint');
    webVitalData.FCP = entry.startTime;
  });
  const monitorLCP = () => {
    const entryHandler: PerformanceEntryHandler = (entry) => {
      webVitalData.LCP = entry.startTime;
    };
    observe('largest-contentful-paint', entryHandler);
  };
  const monitorFID = () => {
    const entryHandler = (entry: PerformanceEventTiming) => {
      webVitalData.FID =
        (entry as PerformanceEventTiming).processingStart - entry.startTime;
      console.log('FID', webVitalData.FID);
    };
    observe('first-input', entryHandler as PerformanceEntryHandler);
  };
  // FP, TTI, DomReady, Load, FirstByte, DNS, TCP, SSL, TTFB, Trans, DomParse, Res
  const monitorNT = afterLoad(() => {
    const entry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    // 关键时间点
    webVitalData.FP = entry.responseEnd - entry.fetchStart;
    webVitalData.TTI = entry.domInteractive - entry.fetchStart;
    webVitalData.DomReady = entry.domContentLoadedEventEnd - entry.fetchStart;
    webVitalData.Load = entry.loadEventStart - entry.fetchStart;
    webVitalData.FirstByte = entry.responseStart - entry.domainLookupStart;
    // 关键时间段
    webVitalData.DNS = entry.domainLookupEnd - entry.domainLookupStart;
    webVitalData.TCP = entry.connectEnd - entry.connectStart;
    webVitalData.SSL = entry.secureConnectionStart
      ? entry.connectEnd - entry.secureConnectionStart
      : 0;
    webVitalData.TTFB = entry.responseStart - entry.requestStart;
    webVitalData.Trans = entry.responseEnd - entry.responseStart;
    webVitalData.DomParse = entry.domInteractive - entry.responseEnd;
    webVitalData.Res = entry.loadEventStart - entry.domContentLoadedEventEnd;
  })
  return {
    beforeInit: () => {
      monitorCLS();
      monitorFCP();
      monitorLCP();
      monitorFID();
      monitorNT();
    },
    beforeStart: () => {
      setTimeout(() => {
        client.send('url', webVitalData);
      }, 10000);
    },
    beforeDestory: () => {
      // 释放obsever
    },
  };
};
