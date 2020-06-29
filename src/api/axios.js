import axios from 'axios'

//  测试地址
axios.defaults.baseURL = "https://autumnfish.cn"

axios.defaults.timeout = 10000;

// 请求拦截
axios.interceptors.request.use(
    config => {
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截

axios.interceptors.response.use(
    res => {
        if (res.status === 200) {
            return Promise.resolve(res.data)
        } else {
            return Promise.reject(res.data)
        }
    },
    err => {
        return Promise.reject(err)
    }
)

export default axios