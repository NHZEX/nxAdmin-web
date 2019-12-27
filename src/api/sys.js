import request from '@/plugin/axios'

export function sysCongig () {
  return request({
    url: '/admin.main/config',
    method: 'get'
  })
}
