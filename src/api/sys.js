import request from '@/plugin/axios'

export function sysCongig () {
  return request.get('/api/system/config')
}

export function sysinfo () {
  return request.get('/api/system/sysinfo')
}

export function captcha () {
  return request.get('/api/system/captcha', {
    // authorization: false,
    responseType: 'blob',
    params: {
    }
  })
}
