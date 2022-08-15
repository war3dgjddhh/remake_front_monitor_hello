import { httpRecord } from '../behaviorStore';
import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

type rv = {
  errUrl: string | URL;
  errBody: any;
  errStatus: number;
  errResponse: any;
  errMethod: string;
  errTime: Date;
};

export const HttpErrDataHandler = (client: Client): Plugin => {
  return {
    beforeBuildData: (_data) => {
      let data = _data as any as errRecord;
      if (_data?.plugin !== 'monitorHttpErr') {
        return data;
      }
      const { method, url, status, body, timestamp, response } =
        data.origin as httpRecord;
      const rv: rv = {
        errUrl: url,
        errBody: body,
        errMethod: method,
        errResponse: response,
        errStatus: status,
        errTime: new Date(timestamp),
      };
      return rv;
    },
  };
};
