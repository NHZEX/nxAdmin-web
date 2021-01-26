import request from '@/plugin/axios'

export const system = new (class {
  congig () {
    return request.get('/api/system/config', {
      authorization: false,
    })
  }

  sysinfo () {
    return request.get('/api/system/sysinfo')
  }

  captcha () {
    return request.get('/api/system/captcha', {
      // authorization: false,
      responseType: 'blob',
      params: {
      }
    })
  }
})()

export const account = new (class {
  login (username, password, code, lasting, token) {
    return request.post('/api/admin/login', {
      account: username,
      password: password,
      captcha: code,
      lasting: lasting,
      token: token,
    })
  }

  logout () {
    return request.get('/api/admin/logout')
  }

  userInfo (silent = false) {
    return request.get('/api/admin/user-info', {
      silent: silent,
    })
  }
})()
