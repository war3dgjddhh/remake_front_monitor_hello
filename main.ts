import { WebPrefDataHandler } from './dataHandlers/WebPrefDataHandler';
import { ErrDataHandler } from './dataHandlers/ErrDataHandler';
import { jsErrDataHandler } from './dataHandlers/jsErrDataHandler';
import { CorsErrDataHandler } from './dataHandlers/CorsErrDataHandler';
import { HttpErrDataHandler } from './dataHandlers/HttpErrDataHandler';
import { monitorResErr } from './monitors/monitorResErr';
import { monitorRes } from './monitors/monitorRes';
import { ResdataHandler } from './dataHandlers/ResdataHandler';
import { PVdataHandler } from './dataHandlers/PVdataHandler';
import { APIdataHandler } from './dataHandlers/APIdataHandler';
import { Client } from './client';
import { browerSender } from './testSender';
import { monitorAPI } from './monitors/monitorAPI';
import { monitorPV } from './monitors/monitorPV';
import { monitorWebPref } from './monitors/monitorWebPref';
import { monitorCorsErr } from './monitors/monitorCorsErr';
import { monitorHttpErr } from './monitors/monitorHttpErr';
import { monitorJsErr } from './monitors/monitorJsErr';
import { resErrDataHandler } from './dataHandlers/resErrDataHandler';
export const client = new Client();
client.registryPlugin(
  browerSender(client, {
    userId: 'aa7385b487e84f28a5e43e7574f4f0aa',
    deviceId: 'e20ca6dd21964f99a7d514bc4c1264e1',
    baseUrl: 'http://localhost:8088/',
  })
);
// 监控接口
client.registryPlugin(monitorAPI(client, { url: '' }));
client.registryPlugin(APIdataHandler(client));
// 监控pv
client.registryPlugin(monitorPV(client, { url: '' }));
client.registryPlugin(PVdataHandler(client));
// 监控pref
client.registryPlugin(monitorWebPref(client, { url: '' }));
client.registryPlugin(WebPrefDataHandler(client));

client.registryPlugin(monitorRes(client, { url: '' }));
client.registryPlugin(ResdataHandler(client));
// 监控异常
client.registryPlugin(ErrDataHandler(client))

client.registryPlugin(monitorHttpErr(client, { url: '' }));
client.registryPlugin(HttpErrDataHandler(client));

client.registryPlugin(monitorCorsErr(client, { url: '' }));
client.registryPlugin(CorsErrDataHandler(client));

client.registryPlugin(monitorJsErr(client, { url: '' }));
client.registryPlugin(jsErrDataHandler(client));

client.registryPlugin(monitorResErr(client, { url: '' }));
client.registryPlugin(resErrDataHandler(client));
