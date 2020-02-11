import request from '@/utils/request'

// 登录
export function login(username, password) {
  const data = {
    account: username,
    password: password
  }

  return request({
    url: '/uaa/sso/login',
    method: 'post',
    data: data,
    auth: {
      username:'web',
      password:'neusoft_base_project'
    }
  })
}

// 登出
export function logout(token) {
  return request({
    url: '/uaa/sso/logout',
    params: {
      token: token
    },
    method: 'post'
  })
}
