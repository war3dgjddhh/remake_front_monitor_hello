import { Client, Plugin } from '../client';
import { errRecord } from '../monitors/monitorJsErr';

type rv = {
  errMsg?: string;
  errTime: Date;
  errType?: string;
};

export const jsErrDataHandler = (client: Client): Plugin => {
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorJsErr') {
        return _data;
      }
      let data = _data as any as errRecord;
      const { errMsg,errType } = data;
      const rv: rv = {
        errMsg,
        errType,
        errTime: new Date(),
      };
      return rv;
    },
  };
};
