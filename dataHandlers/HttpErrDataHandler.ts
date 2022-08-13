import { httpRecord } from '../behaviorStore';
import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

type rv = {
  err_url: string | URL;
  err_body: any;
  err_status: number;
  err_response: any;
  err_method: string;
  err_time: Date;
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
        err_url: url,
        err_body: body,
        err_method: method,
        err_response: response,
        err_status: status,
        err_time: new Date(timestamp),
      };
      return rv;
    },
  };
};
