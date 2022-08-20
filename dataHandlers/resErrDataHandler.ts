import { Client, Plugin } from '../client';
import { resErr } from '../monitors/monitorResErr';

export const resErrDataHandler = (client: Client): Plugin => {
  type rv = {
    errSrc: string;
    errHtml: string;
    errType: string;
    errTime: Date;
  };
  return {
    beforeBuildData: (_data) => {
      if (_data?.plugin !== 'monitorResErr') {
        return _data;
      }
      let data = _data as any as resErr;
      const { src, html, type } = data;

      const rv: rv = {
        errSrc: src,
        errHtml: html,
        errTime: new Date(),
        errType: type,
      };
      return rv;
    },
  };
};
