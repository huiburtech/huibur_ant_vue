import axios from 'axios'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "",
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    return Promise.resolve(error.response.data)
  } 

  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  if (config.header) {
      var keys = Object.keys(config.header)
      keys.forEach(element => {
          config.headers[element] = config.header[element]
      });
  }

  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  console.log(response)
  return response.data
}, errorHandler)



const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios,
}
