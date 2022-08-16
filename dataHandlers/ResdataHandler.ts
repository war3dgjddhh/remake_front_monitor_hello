import { ResourceFlowTiming } from '../monitors/monitorResoure';
import { Client, Plugin } from '../client';
import { webVitalData } from '../monitors/monitorWebPref';

export const WebPrefDataHandler = (client: Client): Plugin => {
  type rv = {
    resSrc: string;
    resTransSize: number;
    resType: string;
    resDuration: number;
    resTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorWebPref') {
        return _data;
      }
      let data = _data as any as ResourceFlowTiming;
      const { name, transferSize, initiatorType, duration, startTime } = data;
      const rv: rv = {
        resSrc: name,
        resDuration: duration,
        resType: initiatorType,
        resTransSize: transferSize,
        resTime: new Date(startTime),
      };
      return rv;
    },
  };
};
