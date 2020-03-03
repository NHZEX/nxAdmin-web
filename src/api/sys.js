import request from '@/plugin/axios'

export function sysCongig () {
  return request.get('/api.system/config')
}

export function sysinfo () {
  return request.get('/api.system/sysinfo')
}

export const URLS = {
  GET_CAPTCHA: 'api.system/captcha',
}
