## 如何使用

npm install npm i remake_front_monitor_hello@0.0.1

> 用户 id 由于失误这个实际上是 appId， 就是一个用户可以有多个 userId， 每个 userId 标识一个网站，然后每个用户只有一个 deviceId 用来验证，相当于是 token，secretKey

```ts
import { client } from 'remake_front_monitor_hello';
client.client.configuer({
  sender: {
    userId: 'aa7385b487e84f28a5e43e7574f4f0aa',
    deviceId: 'e20ca6dd21964f99a7d514bc4c1264e1',
    baseUrl: 'http://localhost:8088/', // 服务器地址
  },
  opt: {
    apiUrl: 'api/store/api', // 这个是配置采集数据的地址
    prefUrl: 'api/store/pref',
    resUrl: 'api/store/res',
    pvUrl: 'api/store/pv',
    jsErrUrl: 'api/store/jsErr',
    httpErrUrl: 'api/store/httpErr',
    corsErrUrl: 'api/store/corsErr',
    resErrUrl: 'api/store/resErr',
    promiseErrUrl: 'api/store/promiseErr',
  },
});
client.init();
client.start();
```

## 错误采集插件 在错误发生时发送用户行为记录

需要在发送的数据添加上 catogory: "error", 在 errDataHandler
中可以做统一处理, 带上 errKey 可以不发送同一个错误等
