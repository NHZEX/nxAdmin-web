import store from '@/store'
import axios from 'axios'
import ivuMessage from '@ivu/message'
import util from '@/libs/util'
import router from '@/router'
import { isPlainObject, get } from 'lodash'
import { blobToString, hasOwnProperty } from '@/libs/util.common'
import { INVALID_SESSION } from '@/plugin/auth'

// 创建一个错误
function errorCreate (msg, code, dataAxios, response, silent) {
  const error = new Error(msg)
  error.code = code
  error.data = dataAxios
  error.resp = response
  if (!silent) {
    handleError(error)
  }
  return error
}

// 记录和显示错误
function handleError (error) {
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
  timeout: 30 * 1000, // 请求超时时间
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (get(config, 'authorization') === false) {
      return config
    }
    // 处理鉴权
    const token = util.cookies.get('token')
    const uuid = util.cookies.get('uuid')
    let authorization = ''
    if (token && uuid) {
      authorization += `TK="${token}" `
    }
    if (store.state.d2admin.config.machine) {
      authorization += `MC="${store.state.d2admin.config.machine}" `
    }
    config.headers.Authorization = `Bearer ${authorization}`.trim()
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
    // 更新用户会话Token
    if (hasOwnProperty(response.headers, 'x-uuid') && hasOwnProperty(response.headers, 'x-token')) {
      util.cookies.set('uuid', response.headers['x-uuid'])
      util.cookies.set('token', response.headers['x-token'])
      // todo 刷新用户远程状态
    }
    if (response.request.responseType === 'blob' || response.data instanceof Blob) {
      return response
    }
    // 直接抽取 axios 返回数据中的 data
    return response.data
  },
  async error => {
    // 静默异常标志
    const silent = !!error.config.silent
    // 响应处理分支
    if (error.response === undefined) {
      throw error
    }
    if (error.response.status === 401) {
      // 删除cookie
      util.cookies.remove('token')
      util.cookies.remove('uuid')
      // 清空用户信息
      await store.dispatch('d2admin/user/clean', {}, { root: true })
      // 跳转到登录页面
      router.push({
        name: 'login',
        params: {
          status: INVALID_SESSION,
        },
      })
    }
    // 异常处理分支
    if (error && error.response) {
      if (isPlainObject(error.response.data)) {
        const errno = error.response.data.errno ? error.response.data.errno : -1
        const message = error.response.data.message ? error.response.data.message : 'Undefined'
        throw errorCreate(`${message} (${error.config.url})`, errno, error.response.data, error.response, silent)
      } else if (error.response.data instanceof Blob) {
        const result = await blobToString(error.response.data)
        let message = 'Undefined'
        let errno = -1
        try {
          const data = JSON.parse(result)
          if (isPlainObject(data)) {
            errno = data.errno
            message = data.message
          }
        } catch (e) {
          message = result
        }
        throw errorCreate(`${message}（${error.config.url}）`, errno, result, error.response, silent)
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
      throw errorCreate(`${error.message} (${error.config.url})`, error.response.status, error.response.data, error.response, silent)
    }
    handleError(error)
    throw error
  }
)

export default service
export const baseUrl = process.env.VUE_APP_API
