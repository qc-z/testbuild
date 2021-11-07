import axios from 'axios'
// import Message from '@/utils/resetMessage'
import { getSession, clearToken } from '@/utils/storage'
import qs from 'qs'
import { API_HOST } from '@/constant'
// const APIHOST =
//   import.meta.env.MODE === 'development'
//     ? import.meta.env.VITE_DEV_HOST
//     : import.meta.env.VITE_PRO_HOST
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // withCredentials的情况下，后端要设置Access-Control-Allow-Origin为你的源地址，例如http://localhost:8080，不能是*，而且还要设置header(‘Access-Control-Allow-Credentials: true’)
  withCredentials: true,
  baseURL: API_HOST,
  timeout: 50000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (getSession()) {
      config.headers.Authorization = getSession()
    }
    // 如果配置了Content-Type为'application/x-www-form-urlencoded'，传进来的不是formData，需要转换成formData
    if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, message, msg } = response.data
    const { responseURL } = response.request
    const MSG = message ?? msg
    const res = {
      data,
      message: MSG
    }
    if (response.status === 200) {
      switch (String(code)) {
        // 成功
        case '200':
          return res

        // 失效
        case '600':
          Message.warning(MSG)
          clearToken()
          // TODO: 登出
          window.location.href = '/#/403'
          break
        // 500 or
        default:
          Message({
            message: `接口:${responseURL}<br /><br />错误信息:${MSG}`,
            type: 'error',
            dangerouslyUseHTMLString: true
          })
          try {
            return Promise.reject(res)
          } catch (e) {
            console.log(e)
          }
      }
    } else {
      return Promise.reject(res)
    }
  },
  (error) => {
    Message({
      message: `接口:${error.request.responseURL}<br /><br />错误信息:${error.message}`,
      type: 'error',
      dangerouslyUseHTMLString: true
    })
    return Promise.reject(JSON.stringify(error))
  }
)
/**
 * 请求核心函数
 * @param {*} options  请求配置
 */
function request(options) {
  // 判断get/post,默认get
  options.method = options.method || 'get'
  // 防止有时候写了GET
  if (['get', 'delete'].includes(options.method.toLowerCase())) {
    // 如果是get就将data直接赋值给params
    // 类型转换
    options.params = options.data
  }

  return service(options)
}
export default request
