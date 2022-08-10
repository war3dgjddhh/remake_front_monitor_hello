import behaviorStore from './behaviorStore';
export type Plugin = {
  beforeInit?: Function;
  beforeStart?: Function;
  beforeMonitorning?: Function;
  beforeBuildData?: (data: object) => object;
  beforeSend?: (url: string, data: object) => void;
  beforeDestory?: Function;
};
export type category = 'error' | 'xxx';
export class Client {
  opt = { url: '' };
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
        _data = el.beforeBuildData(_data)
      }
    })
    return _data;
  }
  send(url: string, _data: object) {
    console.log('DEBUG', _data);
    const data = this.buildData(_data);
    this.plugins?.forEach((el) => {
      el.beforeSend?.(url, data);
    });
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
 *
 */
