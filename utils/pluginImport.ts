import { WebPrefDataHandler } from '../dataHandlers/WebPrefDataHandler';
import { ErrDataHandler } from '../dataHandlers/ErrDataHandler';
import { jsErrDataHandler } from '../dataHandlers/jsErrDataHandler';
import { CorsErrDataHandler } from '../dataHandlers/CorsErrDataHandler';
import { HttpErrDataHandler } from '../dataHandlers/HttpErrDataHandler';
import { monitorResErr } from '../monitors/monitorResErr';
import { monitorRes } from '../monitors/monitorRes';
import { ResdataHandler } from '../dataHandlers/ResdataHandler';
import { PVdataHandler } from '../dataHandlers/PVdataHandler';
import { APIdataHandler } from '../dataHandlers/APIdataHandler';
import { browerSender } from '../testSender';
import { monitorAPI } from '../monitors/monitorAPI';
import { monitorPV } from '../monitors/monitorPV';
import { monitorWebPref } from '../monitors/monitorWebPref';
import { monitorCorsErr } from '../monitors/monitorCorsErr';
import { monitorHttpErr } from '../monitors/monitorHttpErr';
import { monitorJsErr } from '../monitors/monitorJsErr';
import { resErrDataHandler } from '../dataHandlers/resErrDataHandler';
export {
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
};
