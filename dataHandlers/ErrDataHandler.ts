import { errRecord } from '../monitors/monitorJsErr';
import { Client, Plugin } from '../client';

export const ErrDataHandler = (client: Client): Plugin => {
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
      let data = _data as any;
      if (data.category === 'error') {
        if (!errUids.includes(data.errUid)) {
          data = errDataBuild(data);
        }
      }
      return data;
    },
  };
};
