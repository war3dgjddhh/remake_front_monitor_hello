import behaviorStore from './behaviorStore';
import './utils/pluginImport';
import {
  WebPrefDataHandler,
  ErrDataHandler,
  jsErrDataHandler,
  CorsErrDataHandler,
  HttpErrDataHandler,
  monitorResErr,
  monitorRes,
  ResdataHandler,
  PVdataHandler,
  APIdataHandler,
  browerSender,
  monitorAPI,
  monitorPV,
  monitorWebPref,
  monitorCorsErr,
  monitorHttpErr,
  monitorJsErr,
  resErrDataHandler,
} from './utils/pluginImport';
export type Plugin = {
  beforeInit?: Function;
  beforeStart?: Function;
  beforeMonitorning?: Function;
  beforeBuildData?: (data: { plugin: string }) => object;
  beforeSend?: (url: string, data: object) => void;
  beforeDestory?: Function;
};
export type category = 'error' | 'xxx';
type config = {
  sender: {
    userId: string;
    deviceId: string;
    baseUrl: string;
  };
  opt?: opt;
};
type opt = {
  apiUrl: string;
  prefUrl: string;
  resUrl: string;
  pvUrl: string;
  jsErrUrl: string;
  httpErrUrl: string;
  corsErrUrl: string;
  resErrUrl: string;
  promiseErrUrl: string;
};
export class Client {
  opt?:opt;
  plugins?: Plugin[] = [];
  sender: { send?: Function } = {};
  breadcrumbs = new behaviorStore({ maxBehaviorRecords: 100 });
  config: config = {
    sender: {
      userId: 'aa7385b487e84f28a5e43e7574f4f0aa',
      deviceId: 'e20ca6dd21964f99a7d514bc4c1264e1',
      baseUrl: 'http://localhost:8088/',
    },
    opt: {
      apiUrl: 'api/store/api',
      prefUrl: 'api/store/pref',
      resUrl: 'api/store/res',
      pvUrl: 'api/store/pv',
      jsErrUrl: 'api/store/jsErr',
      httpErrUrl: 'api/store/httpErr',
      corsErrUrl: 'api/store/corsErr',
      resErrUrl: 'api/store/resErr',
      promiseErrUrl: 'api/store/promiseErr',
    },
  };

  registryPlugin(...plugins: Plugin[]) {
    plugins.forEach((el) => {
      this.plugins?.push(el);
    });
  }
  configuer(config = this.config) {
    this.opt = this.config.opt
    // sender 能力， 还不会做请求重试， 队列啥的， 默认使用sendbeacon
    this.registryPlugin(browerSender(this, config.sender));
    // 监控接口
    this.registryPlugin(monitorAPI(this, { url: '' }));
    this.registryPlugin(APIdataHandler(this));
    // 监控pv
    this.registryPlugin(monitorPV(this, { url: '' }));
    this.registryPlugin(PVdataHandler(this));
    // 监控pref
    this.registryPlugin(monitorWebPref(this, { url: '' }));
    this.registryPlugin(WebPrefDataHandler(this));

    this.registryPlugin(monitorRes(this, { url: '' }));
    this.registryPlugin(ResdataHandler(this));
    // 监控异常
    this.registryPlugin(ErrDataHandler(this));

    this.registryPlugin(monitorHttpErr(this, { url: '' }));
    this.registryPlugin(HttpErrDataHandler(this));

    this.registryPlugin(monitorCorsErr(this, { url: '' }));
    this.registryPlugin(CorsErrDataHandler(this));

    this.registryPlugin(monitorJsErr(this, { url: '' }));
    this.registryPlugin(jsErrDataHandler(this));

    this.registryPlugin(monitorResErr(this, { url: '' }));
    this.registryPlugin(resErrDataHandler(this));
  }
  init() {
    this.plugins?.forEach((el) => {
      el.beforeInit?.();
    });
  }
  start() {
    this.plugins?.forEach((el) => {
      el.beforeStart?.();
    });
  }
  buildData(_data: object): object {
    this.plugins?.forEach((el) => {
      if (typeof el.beforeBuildData != 'undefined') {
        // console.log(el)
        _data = el.beforeBuildData(_data as any);
      }
    });
    return _data;
  }
  send(url: string, _data: { plugin: string }) {
    const data = this.buildData(_data);
    this.plugins?.forEach((el) => {
      el.beforeSend?.(url, data);
    });
    if (typeof data !== 'undefined') {
      console.log('DEBUG', data);
      this.sender.send?.(url, data);
    }
  }

}
/**
 * 如何实现生命周期
 * init
 * start
 * 约定不发送undifined
 */
