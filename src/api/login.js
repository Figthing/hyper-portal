import api from './index'
import { axios } from '@/utils/request'

// 用户登录
export function login (parameter) {
  return axios({
    url: api.login,
    method: 'post',
    data: parameter,
    headers: {
      'Authorization': 'Basic aHlwZXI6aHlwZXJfYmFzZV9wcm9qZWN0',
      'Content-Type': 'application/json'
    }
  })
}

// 获取个人信息
export function getInfo () {
  return axios({
    url: api.getOperInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 更新个人资料
export function updateInfo(data) {
	return axios({
		url: api.updateOperInfo,
		method: 'put',
		data: data
	})
}

// 更新个人密码
export function updatePass(data) {
	return axios({
		url: api.updateOperPass,
		method: 'put',
		params: data
	})
}

// 获取当前用户的导航
export function getCurrentUserNav () {
  return axios({
    url: api.getOperNav,
    method: 'get'
  })
}

// 获取当前用户的权限
export function getCurrentUserPermission () {
  return axios({
    url: api.getOperPermission,
    method: 'get'
  })
}

// 退出登录
export function logout (token) {
  return axios({
    url: api.logout,
    method: 'post',
    params: {
      token: token
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
