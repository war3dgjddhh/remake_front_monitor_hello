import behaviorStore from './behaviorStore';
export type Plugin = {
  beforeInit?: Function;
  beforeStart?: Function;
  beforeMonitorning?: Function;
  beforeBuildData?: (data: { plugin: string }) => object;
  beforeSend?: (url: string, data: object) => void;
  beforeDestory?: Function;
};
export type category = 'error' | 'xxx';
export class Client {
  opt = {
    apiUrl: 'api/store/api',
    prefUrl: 'api/store/pref',
    resUrl: 'api/store/res',
    pvUrl: 'api/store/pv',
    jsErrUrl: 'api/store/jsErr',
    httpErrUrl: 'api/store/httpErr',
    corsErrUrl: 'api/store/corsErr',
    resErrUrl: 'api/store/resErr',
    promiseErrUrl: 'api/store/promiseErr',
  }; // 默认值
  plugins?: Plugin[] = [];
  sender: { send?: Function } = {};
  breadcrumbs = new behaviorStore({ maxBehaviorRecords: 100 });

  registryPlugin(...plugins: Plugin[]) {
    plugins.forEach((el) => {
      this.plugins?.push(el);
    });
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
  monitorning() {
    this.plugins?.forEach((el) => {
      el.beforeMonitorning?.();
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
  destory() {
    this.plugins?.forEach((el) => {
      el.beforeDestory?.();
    });
  }
}
/**
 * 如何实现生命周期
 * init
 * start
 * 约定不发送undifined
 */
