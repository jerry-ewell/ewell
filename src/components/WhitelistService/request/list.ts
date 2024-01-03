// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { API_REQ_FUNCTION } from './types';

export const DEFAULT_METHOD = 'GET';

/**
 * api request configuration directory
 * @example
 *    upload: {
 *      target: '/api/file-management/file-descriptor/upload',
 *      baseConfig: { method: 'POST', },
 *    },
 * or:
 *    upload:'/api/file-management/file-descriptor/upload'
 *
 * @description api configuration default method is from DEFAULT_METHOD
 * @type {UrlObj}  // The type of this object from UrlObj.
 */
export const BASE_APIS = {
  getWhitelistInfo: '/whitelist-proxy/api/app/whitelist/by-hash',
  getExtraInfos: '/whitelist-proxy/api/app/whitelist/extra-infos',
  getManagers: '/whitelist-proxy/api/app/whitelist/managers',
  getTags: '/whitelist-proxy/api/app/whitelist/tags',
  getPriceTokens: '/whitelist-proxy/api/app/whitelist/price-tokens',
};

export type BASE_REQ_TYPES = {
  [x in keyof typeof BASE_APIS]: API_REQ_FUNCTION;
};
