import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    // 它可以通过设置一个 'baseURL' 便于为 axios 实例的方法传递相对 URL
    baseURL: process.env.VUE_APP_BASE_API,
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求花费了超过 `timeout` 的时间，请求将被中断
    timeout: 5000
})

// request 拦截器
request.interceptors.request.use(config => {
    // config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        return res;
    },
    error => {
        return Promise.reject(error)
    }
)
export default request
