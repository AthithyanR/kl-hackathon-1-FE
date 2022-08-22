import axios from 'axios';
import { getFromLs } from './utils';

const baseApi = axios.create({
  timeout: 120,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

baseApi.interceptors.request.use((config) => {
  Object.assign(config.headers, { Authorization: `Bearer ${getFromLs('token')}` });
  return config;
});

export default baseApi;
