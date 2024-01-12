import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
});

axiosInstance.defaults.headers.common['x-csrf-token'] = 'AUTH_TOKEN';

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const service = axiosInstance;

export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}
