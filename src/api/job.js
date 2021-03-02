import api from './index'
import { axios } from '@/utils/request'

// 根据WHERE获取岗位
export function listPageJobByWhere(where) {
  return axios({
	url: api.listPageJobByWhere,
	method: 'get',
	params: where
  })
}

// 根据IDS删除岗位
export function deleteByIds(data) {
  return axios({
	url: api.deleteJobByIds,
	method: 'delete',
	data: data
  })
}

// 新增字典
export function insertJob(data) {
	console.info(data)
  return axios({
	url: api.insertJob,
	method: 'post',
	data: data
  })
}