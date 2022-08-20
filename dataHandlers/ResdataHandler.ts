import { ResourceFlowTiming } from '../monitors/monitorRes';
import { Client, Plugin } from '../client';

export const ResdataHandler = (client: Client): Plugin => {
  type rv = {
    resSrc: string;
    resTransSize: number;
    resType: string;
    resDuration: number;
    resTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorRes') {
        return _data;
      }
      let { data } = _data as any;

      let rv: rv[] = [];
      (data as ResourceFlowTiming[]).forEach((el) => {
        const { name, transferSize, initiatorType, duration, startTime } = el;
        rv.push({
          resSrc: name,
          resDuration: duration,
          resType: initiatorType,
          resTransSize: transferSize,
          resTime: new Date(startTime),
        });
      });
      return rv;
    },
  };
};
