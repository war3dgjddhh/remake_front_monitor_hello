import { Client, Plugin } from '../client';
import { PV } from '../monitors/monitorPV';

export const PVdataHandler = (client: Client): Plugin => {
  type rv = {
    routePath: string;
    duration: number;
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
        duration,
        pvTime: new Date(startTime),
      };
      return rv;
    },
  };
};
