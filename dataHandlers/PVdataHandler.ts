import { Client, Plugin } from '../client';
import { PV } from '../monitors/monitorPV';

export const PVdataHandler = (client: Client): Plugin => {
  type rv = {
    routePath: string;
    pageDuration: number;
    pvTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorPV') {
        return _data;
      }
      let data = _data as any as PV;
      const { duration, startTime, routePath } = data;
      const rv: rv = {
        routePath,
        pageDuration: duration,
        pvTime: new Date(startTime),
      };
      return rv;
    },
  };
};
