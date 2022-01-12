import request from '@/plugin/axios'

export const system = new (class {
  congig () {
    return request.get('/system/config', {
      authorization: false,
    })
  }

  sysinfo () {
    return request.get('/system/sysinfo')
  }

  captcha () {
    return request.get('/system/captcha', {
      // authorization: false,
      responseType: 'blob',
      params: {
      }
    })
  }

  resetCache () {
    return request.post('/system/resetCache')
  }
})()

export const account = new (class {
  login (username, password, code, lasting, token) {
    return request.post('/admin/login', {
      account: username,
      password: password,
      captcha: code,
      lasting: lasting,
      token: token,
    })
  }

  logout () {
    return request.get('/admin/logout')
  }

  userInfo (silent = false) {
    return request.get('/admin/user-info', {
      silent: silent,
    })
  }
})()
