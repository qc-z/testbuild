/**
 * axios二次封装
 */
import axios from 'axios'
import config from './../config'
import router from './../router'
import { ElMessage } from 'element-plus'

const TOKEN_INVALID = 'Token认证失败，请从新登陆'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截器
service.interceptors.request.use((req) => {
  // to do
  const headers = req.headers
  if (!headers.Authorization) headers.Authorization = 'Bear token'
  return req
})

// 响应拦截器
service.interceptors.response.use((res) => {
  // to do
  /**
   * 注意状态码一共有两个
   * 一为http状态码
   * 二为接口返回状态码
   */
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 40001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 15000)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求核心函数
 * @param {*} options  请求配置
 */
function request(options) {
  // 判断get/post
  options.method = options.method || 'get'
  // 防止有时候写了GET
  if (options.method.toLowerCase() === 'get') {
    // 如果是get就将data直接赋值给params
    // 类型转换
    options.params = options.data
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}

export default request
