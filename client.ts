import behaviorStore from './behaviorStore';
export type Plugin = {
  beforeInit?: Function;
  beforeStart?: Function;
  beforeMonitorning?: Function;
  beforeBuildData?: Function;
  beforeSend?: (url:string, data: object)=>void;
  beforeDestory?: Function;
};
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
  buildData() {
    this.plugins?.forEach((el) => {
      el.beforeBuildData?.();
    });
  }
  send(url: string, data: object) {
    console.log("DEBUG",data)
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
