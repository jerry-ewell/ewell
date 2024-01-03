import { BASE_APIS, BASE_REQ_TYPES, DEFAULT_METHOD } from './list';
import myServer from './server';
import { IBaseRequest } from './types';
import { spliceUrl, service } from './utils';

function baseRequest({ url, method = DEFAULT_METHOD, query = '', ...c }: IBaseRequest) {
  return service({
    ...c,
    url: spliceUrl(url, query),
    method,
  });
}

myServer.parseRouter('base', BASE_APIS);

const request: BASE_REQ_TYPES = Object.assign({}, myServer.base, myServer);

export { baseRequest, request };
