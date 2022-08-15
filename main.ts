import { Client } from './client';
import { browerSender } from './testSender';
import { monitorAPI } from './monitors/monitorAPI';
import { monitorPV } from './monitors/monitorPV';
import { monitorWebPref } from './monitors/monitorWebPref';
import { monitorCorsErr } from './monitors/monitorCorsErr';
import { monitorHttpErr } from './monitors/monitorHttpErr';
import { monitorJsErr } from './monitors/monitorJsErr';
const client = new Client();
client.registryPlugin(
  browerSender(client, {
    userId: '',
    deviceId: '',
    baseUrl: '',
  })
);
client.registryPlugin(monitorAPI(client, { url: '' }));
client.registryPlugin(monitorPV(client));
client.registryPlugin(monitorCorsErr(client));
client.registryPlugin(monitorHttpErr(client));
client.registryPlugin(monitorJsErr(client));
client.registryPlugin(monitorWebPref(client, { monitorningCLS: true }));
