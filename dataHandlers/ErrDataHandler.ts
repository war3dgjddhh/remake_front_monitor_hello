import { category } from './../client';
import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

export const ErrDataHandler = (client: Client): Plugin => {
  return {
    beforeBuildData: (_data) => {
      let data = _data as errRecord;
      if (data.category === 'error') { 
        data = {
          ...data,
          breadcrumbs: client.breadcrumbs,
        } as any
      }
      client.breadcrumbs.clear;
      return data
    },
  };
};
