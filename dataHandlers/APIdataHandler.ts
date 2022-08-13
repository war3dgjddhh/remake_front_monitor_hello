import { httpRecord } from './../behaviorStore';
import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

type rv = {
  api_method: string;
  api_url: URL | string;
  api_body: any;
  api_time: Date;
  api_status: number;
};

export const APIdataHandler = (client: Client): Plugin => {
  const errUids: Array<string> = [];
  const errDataBuild = (_data: errRecord) => {
    const data = {
      ..._data,
      breadcrumbs: client.breadcrumbs.get(),
    };
    client.breadcrumbs.clear();
    errUids.push(data.errUid);
    return data;
  };
  return {
    beforeBuildData: (_data) => {
      let data = _data as any as httpRecord;
      if (_data?.plugin === 'monitorAPI') {
        const { method, url, status, body, timestamp } = data;
        const rv: rv = {
          api_body: body,
          api_url: url,
          api_method: method,
          api_time: new Date(timestamp),
          api_status: status,
        };
        return rv;
      }
      return data;
    },
  };
};
