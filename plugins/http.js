import axios from 'axios'

import { Message, Notification } from 'element-ui' // 这里使用了element-ui的消息提示方法，也可自行定义 

import { getToken } from './auth'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
let service = axios.create({
  // baseURL: 'https://tool.longming.com',
  timeout: 10000
})

 // 请求拦截 可在请求头中加入token等
service.interceptors.request.use(function(config) {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  return config

}, function(error) {
  // console.log(error)
  return Promise.reject(error)
})

// 响应拦截 对响应消息作初步的处理
service.interceptors.response.use(function(resp) {
  // console.log(resp)
  if (resp.data) {
    if (resp.data.code !== 200) {
      Message({
        type: 'error',
        message: resp.data.msg,
        duration: 3000,
        closable: true
      })
    }else{
      return resp.data 
    }
  } else {
    return resp
  }
}, function(error) {
  // console.log(error.response)
  if (error.response) {
    Notification.error({
      title: error.response.status,
      duration: 3000,
      closable: true
    })
  }
  return Promise.reject(error)
})

export default service