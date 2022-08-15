import { httpRecord } from './../behaviorStore';
import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

type rv = {
  apiMethod: string;
  apiUrl: URL | string;
  apiTime: Date;
  apiStatus: number;
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
        const { method, url, status, timestamp } = data;
        const rv: rv = {
          apiUrl: url,
          apiMethod: method,
          apiTime: new Date(timestamp),
          apiStatus: status,
        };
        return rv;
      }
      return data;
    },
  };
};
