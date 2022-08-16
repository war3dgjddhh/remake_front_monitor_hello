import { httpRecord } from './../behaviorStore';
import { Client, Plugin } from '../client';

type rv = {
  apiMethod: string;
  apiUrl: URL | string;
  apiTime: Date;
  apiStatus: number;
};

export const APIdataHandler = (client: Client): Plugin => {
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin === 'monitorAPI') {
        return _data;
      }
      let data = _data as any as httpRecord;
      const { method, url, status, timestamp } = data;
      const rv: rv = {
        apiUrl: url,
        apiMethod: method,
        apiTime: new Date(timestamp),
        apiStatus: status,
      };
      return rv;
    },
  };
};
