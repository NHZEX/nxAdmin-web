import request from '@/plugin/axios'

export function accountLogin (username, password, code, lasting, token) {
  return request.post('/api.admin.auth/login', {
    'account': username,
    'password': password,
    'captcha': code,
    'lasting': lasting,
    'token': token,
  })
}

export function accountLogout () {
  return request.get('/api.admin.auth/logout')
}

export function userInfo () {
  return request.get('/api.admin.auth/userInfo')
}
