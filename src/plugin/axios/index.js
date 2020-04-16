import store from '@/store'
import axios from 'axios'
import ivuMessage from '@ivu/message'
import util from '@/libs/util'
import router from '@/router'
import { isPlainObject } from 'lodash'
import { hasOwnProperty } from '@/libs/util.common'

// 创建一个错误
function errorCreate (msg, code, dataAxios, response) {
  const error = new Error(msg)
  error.code = code
  error.data = dataAxios
  error.resp = response
  errorLog(error)
  return error
}

// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error,
    },
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  ivuMessage.error({
    content: error.message,
    duration: 5,
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000, // 请求超时时间
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = util.cookies.get('token')
    const uuid = util.cookies.get('uuid')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    if (token && uuid) {
      config.headers['X-Token'] = token
    }
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 尝试更新Token
    if (hasOwnProperty(response.headers, 'x-uuid') && hasOwnProperty(response.headers, 'x-token')) {
      util.cookies.set('uuid', response.headers['x-uuid'])
      util.cookies.set('token', response.headers['x-token'])
      // todo 刷新用户远程状态
    }
    // 直接抽取 axios 返回数据中的 data
    return response.data
  },
  error => {
    if (error.response.status === 401) {
      // 删除cookie
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      // 清空 vuex 用户信息
      store.dispatch('d2admin/user/set', {}, { root: true })
      router.push({ name: 'login' })
    }
    if (error && error.response) {
      if (isPlainObject(error.response.data)) {
        const errno = error.response.data.errno ? error.response.data.errno : -1
        const message = error.response.data.message ? error.response.data.message : 'Undefined'
        throw errorCreate(`${message}: ${error.config.url}`, errno, error.response.data, error.response)
      } else {
        switch (error.response.status) {
          case 400: error.message = '请求错误'; break
          case 401: error.message = '未授权，请登录'; break
          case 403: error.message = '拒绝访问'; break
          case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
          case 408: error.message = '请求超时'; break
          case 500: error.message = '服务器内部错误'; break
          case 501: error.message = '服务未实现'; break
          case 502: error.message = '网关错误'; break
          case 503: error.message = '服务不可用'; break
          case 504: error.message = '网关超时'; break
          case 505: error.message = 'HTTP版本不受支持'; break
          default: break
        }
      }
      throw errorCreate(`${error.message}: ${error.config.url}`, error.response.status, error.response.data, error.response)
    }
  }
)

export default service
export const baseUrl = process.env.VUE_APP_API
