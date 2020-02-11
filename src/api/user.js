import request from '@/utils/request'

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/upms/oper/info',
    method: 'get'
  })
}

// 更新用户资料
export function updateUserInfo(user) {

	var data = {
		name: user.name,
		phone: user.phone,
		sex: user.sex,
		birthday: user.birthday,
		email: user.email,
		address: user.address
	}

	return request({
		url: '/upms/oper/info',
		method: 'put',
		data: data
	})
}

// 修改用户密码
export function updateUserPass(oldPass, newPass) {
	var data = {
		oldPwd: oldPass,
		newPwd: newPass
	}

	return request({
		url: '/upms/oper/pass',
		method: 'put',
		params: data
	})
}

// 获取用户列表
export function listUsers(where) {
	return request({
		url: '/upms/oper/mgr/search',
		method: 'get',
		params: where
	})
}

// 获取该用户路由
export const listRouters = () => {
	return request({
	  url: '/upms/oper/routes',
	  method: 'get'
	})
  }