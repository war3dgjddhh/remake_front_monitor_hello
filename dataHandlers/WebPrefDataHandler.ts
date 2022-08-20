import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';
import { webVitalData } from '../monitors/monitorWebPref';

export const WebPrefDataHandler = (client: Client): Plugin => {
  type rv = {
    prefFp: number;
    prefTti: number;
    prefDomReady: number;
    prefLoad: number;
    prefFirstByte: number;
    prefDns: number;
    prefTcp: number;
    prefSsl: number;
    prefTtfb: number;
    prefTrans: number;
    prefDomParse: number;
    prefRes: number;
    prefCls: number;
    prefFcp: number;
    prefFid: number;
    prefLcp: number;
    reportTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorWebPref') {
        return _data;
      }
      let data = _data as any as webVitalData;
      const {
        FP,
        TTI,
        DomReady,
        Load,
        FirstByte,
        DNS,
        TCP,
        SSL,
        TTFB,
        Trans,
        DomParse,
        Res,
        CLS,
        FCP,
        LCP,
        FID,
      } = data;

      const rv: rv = {
        prefFp: Math.floor(FP * 100) / 100,
        prefTti: Math.floor(TTI * 100) / 100,
        prefDomReady: Math.floor(DomReady * 100) / 100,
        prefLoad: Math.floor(Load * 100) / 100,
        prefFirstByte: Math.floor(FirstByte * 100) / 100,
        prefDns: Math.floor(DNS * 100) / 100,
        prefTcp: Math.floor(TCP * 100) / 100,
        prefSsl: Math.floor(SSL * 100) / 100,
        prefTtfb: Math.floor(TTFB * 100) / 100,
        prefTrans: Math.floor(Trans * 100) / 100,
        prefDomParse: Math.floor(DomParse * 100) / 100,
        prefRes: Math.floor(Res * 100) / 100,
        prefCls: Math.floor(CLS * 100) / 100,
        prefFcp: Math.floor(FCP * 100) / 100,
        prefFid: Math.floor(FID * 100) / 100,
        prefLcp: Math.floor(LCP * 100) / 100,
        reportTime: new Date(),
      };
      return rv;
    },
  };
};
