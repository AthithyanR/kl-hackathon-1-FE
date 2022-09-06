/* eslint-disable no-console */
import axios from 'axios';
import { flushLs, getFromLs } from './utils';

const baseApi = axios.create({
  timeout: 120 * 1000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status === 200,
});

// req interceptor
baseApi.interceptors.request.use((config) => {
  Object.assign(config, { url: `/api${config.url}` });
  Object.assign(config.headers, { Authorization: `Bearer ${getFromLs('token')}` });
  return config;
}, (error) => {
  console.error('Api request error happened :-(', error);
  Promise.reject(error);
});

// res interceptor
baseApi.interceptors.response.use((response) => {
  if (!response.data?.success) {
    return Promise.reject(response.data);
  }
  return response.data;
}, (error) => {
  if (error.response.status === 401) {
    flushLs();
    return window.location.replace('/login');
  }
  if (error.response.status !== 200) {
    return Promise.reject(error.response);
  }
  console.error('Api response error happened :-(', error);
  return Promise.reject(error);
});

export default baseApi;
