import axios from 'axios'
import Taro from "@tarojs/taro"

const URL = "https://autumnfish.cn";

// 创建一个接口实例
let http = axios.create({
    timeout: 10000,
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

//app真机获取
http.defaults.adapter = function (config) {
    return new Promise((resolve, reject) => {
        var settle = require('axios/lib/core/settle');
        var buildURL = require('axios/lib/helpers/buildURL');
        Taro.request({
            method: config.method.toUpperCase(),
            url: buildURL(URL + config.url, config.params),
            header: config.headers,
            data: config.data,
            responseType: config.responseType,
            complete: function complete(response) {
                response = {
                    data: response.data,
                    status: response.statusCode,
                    errMsg: response.errMsg,
                    header: response.header,
                    config: config
                };
                settle(resolve, reject, response)
            }
        })
    })
}


// 请求拦截
http.interceptors.request.use(
    config => {
        return config
    },
    error => Promise.reject(error),
)

// 响应拦截

http.interceptors.response.use(
    res => {
        if (res.status === 200) {
            return Promise.resolve(res.data)
        } else {
            return Promise.resolve(res.data)
        }
    },
    err => {
        return Promise.reject(err)
    },
)

export default http