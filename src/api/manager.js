import api from './index'
import { axios } from '@/utils/request'

// 根据人员ID获取角色
export function getManagerByOperId(data) {
	return axios({
		url: api.getManagerByOperId({id: data}),
		method: 'get'
	})
}

// 获取人员列表
export function listManager(where) {
	return axios({
		url: api.listManager,
		method: 'get',
		params: where
	})
}

// 新增人员列表
export function insertManager(data) {
	return axios({
		url: api.insertManager,
		method: 'post',
		data: data
	})
}

// 更新人员信息
export function updateManager(id, data) {
	return axios({
		url: api.updateManager({id: id}),
		method: 'put',
		data: data
	}) 
}

// 重置人员密码
export function resetManagerPass(id, pass) {
	return axios({
		url: api.resetManagerPass({id: id}),
		method: 'put',
		params: {
		  newPwd: pass
		}
	}) 
}

// 变更人员状态
export function updateManagerStatus(id, data) {
	return axios({
		url: api.updateManagerStatus({id: id}),
		method: 'put',
		params: {
			status: data
		}
	}) 
}

// 删除人员列表
export function deleteManager(data) {
	return axios({
		url: api.deleteManager,
		method: 'delete',
		data: data
	})
}
