import request, { baseUrl } from '@/plugin/axios'

export function sysCongig () {
  return request.get('/api/system/config')
}

export function sysinfo () {
  return request.get('/api/system/sysinfo')
}

export const SYS_URLS = {
  GET_CAPTCHA: `${baseUrl}api/system/captcha`,
}
