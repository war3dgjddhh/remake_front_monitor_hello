插件 monitorAPI
返回格式

```js
type rv = {
  api_method: string;
  api_url: URL | string;
  api_body: any;
  api_time: Date;
};
```
这样后端查询api错误率就直接查完总数在除以status<400的就行 // api错误率 解决
插件monitorHttpErr
返回格式
```js
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
插件monitorJsErr.ts
返回格式
