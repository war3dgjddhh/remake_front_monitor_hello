import { Client, Plugin } from '../client';
import { PV } from '../monitors/monitorPV';

export const WebPrefDataHandler = (client: Client): Plugin => {
  type rv = {
    routePath: string;
    duration: number;
    pvTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      let data = _data as any as PV;
      if (_data?.plugin === 'monitorPV') {
        const { duration, startTime, routePath } = data;
        const rv: rv = {
          routePath,
          duration,
          pvTime: new Date(startTime),
        }
        return rv;
      }
      return data;
    },
  };
};
