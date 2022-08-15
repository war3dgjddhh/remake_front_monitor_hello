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
这样后端查询api错误率就直接查完总数在除以status<400的就行 // api错误率 解决

## 插件ErrDataHandler 
> 主要处理发送错误信息的连锁行为, e.g 发生错误时, 发送用户行为栈并清空
用户用为类型
1. 请求api
2. 点击(ignore)
3. 路由跳转(SPA尤其重视)


## 插件monitorHttpErr
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
}
```
## 插件monitorJsErr.ts
返回格式

## 插件monitorWebPref.ts
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
```ts

```
