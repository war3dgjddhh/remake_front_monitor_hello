import { Client, Plugin } from '../client';
import { errRecord } from '../monitors/monitorJsErr';

type rv = {
  errMsg?: string;
  errTime: Date;
};

export const CorsErrDataHandler = (client: Client): Plugin => {
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorCorsErr') {
        return _data;
      }
      let data = _data as any as errRecord;
      const { errMsg } = data;
      const rv: rv = {
        errMsg,
        errTime: new Date(),
      };
      return rv;
    },
  };
};
