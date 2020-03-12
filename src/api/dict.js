import api from './index'
import { axios } from '@/utils/request'

// 根据Where获取字典
export function listPageDictByWhere(data) {
  return axios({
    url: api.listPageDict,
    method: 'get',
    params: data
  })
}

// 新增字典
export function insertDict(data) {
  return axios({
    url: api.insertDict,
    method: 'post',
    data: data
  })
}

// 更新字典
export function updateDictById(id, data) {
  return axios({
    url: api.updateDictById({id: id}),
    method: 'put',
    data: data
  })
}

// 根据IDS删除字典
export function deleteByIds(data) {
  return axios({
    url: api.deleteByIds,
    method: 'delete',
    data: data
  })
}