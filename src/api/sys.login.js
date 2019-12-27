import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/admin.login/login',
    method: 'post',
    data
  })
}

export function AccountLogout () {
  return request({
    url: '/admin.login/logout',
    method: 'get'
  })
}

export function UserInfo () {
  return request({
    url: '/admin.main/userInfo',
    method: 'get',
    params: {
      ajax: true
    }
  })
}
