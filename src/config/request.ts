import axios from "axios";

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

// request 拦截器
request.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 拦截器
request.interceptors.response.use(
  response => {
    let res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);
export default request;

