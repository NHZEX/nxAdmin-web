import request from '@/plugin/axios'

export function sysCongig () {
  return request.get('/admin.main/config')
}
