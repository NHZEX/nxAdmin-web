import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request.post('/admin.login/login', data)
}

export function AccountLogout () {
  return request.get('/admin.login/logout')
}

export function UserInfo () {
  return request.get('/api.admin.auth/userInfo')
}
