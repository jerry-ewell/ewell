import { API_REQ_FUNCTION, UrlObj } from './types';

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

const AuthList = {
  token: {
    target: '/connect/token',
    baseConfig: { method: 'POST' },
  },
};

const ProjectApiList = {
  getProjectList: '/api/app/project/list',
  getTokenList: '/api/app/token/list',
  getProjectUserList: '/api/app/project/userList',
};

const AssetsApiList = {
  getTxFee: '/api/app/project/fee',
  getTokenPrice: '/api/app/token/price',
};
/**
 * api request extension configuration directory
 * @description object.key // The type of this object key comes from from @type {UrlObj}
 */
export const EXPAND_APIS = { project: ProjectApiList, auth: AuthList, assets: AssetsApiList };

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};
