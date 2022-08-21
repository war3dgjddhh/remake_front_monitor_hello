## 插件 monitorAPI

返回格式

```ts
type rv = {
  apiMethod: string;
  apiUrl: URL | string;
  apiTime: Date;
  apiStatus: number;
};
```

这样后端查询 api 错误率就直接查完总数在除以 status<400 的就行 // api 错误率 解决

## 插件 ErrDataHandler

> 主要处理发送错误信息的连锁行为, e.g 发生错误时, 发送用户行为栈并清空
> 用户用为类型

1. 请求 api
2. 点击(ignore)
3. 路由跳转(SPA 尤其重视)

## 插件 monitorHttpErr

返回格式

```ts
type errRecord = {
  category: category; // ignore
  mechanism: string;
  errMsg?: string;
  errType: string;
  errUid: string;
  stackTrace?: object;
  pageInfo?: PageInfo;
  breadcrumbs?: Array<behaviorStack>;
};
```

## 插件 monitorJsErr.ts

返回格式

## 插件 monitorWebPref.ts

采集数据

```ts
export type MeNavigationTiming = {
  FP?: number; // 白屏时间
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirstByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number; // content download
  DomParse?: number;
  Res?: number; // resourece download
};
export type webVitalData = {
  CLS: number;
  FCP: number;
  FID: number; // first input delay
  LCP: number;
} & MeNavigationTiming;
```

## 插件 WebPrefDataHandler.ts

返回数据
上报策略(当 client.start 执行之后 10s
就上报,不管 FID 是否获取到)

```ts
type rv = {
  prefFp: number;
  prefTti: number;
  prefDomReady: number;
  prefLoad: number;
  prefFirstByte: number;
  prefDns: number;
  prefTcp: number;
  prefSsl: number;
  prefTtfb: number;
  prefTrans: number;
  prefDomParse: number;
  prefRes: number;
  prefCls: number;
  prefFcp: number;
  prefFid: number;
  prefLcp: number;
  reportTime: Date;
};
```

## 插件 monitorPv.ts

采集数据 每个页面的停留时间
A -> B 页面 记录一次 A 1s
B -> A 页面 记录一次 B 2s
这样 pv 就是 2

1. 查看 A, B 页面的停留时间
   uv 就是把 userId 拿过来去重就得到 pv
2. 分析页面的重要程度, 用户最喜欢
   那个页面

```ts
export type PV = {
  routePath: string;
  duration: number;
};
```
