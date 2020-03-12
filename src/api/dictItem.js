import api from './index'
import { axios } from '@/utils/request'

// 根据Type获取字典数据
export function listDictItemByType(type) {
  return axios({
    url: api.listDictItemByType({type: type}),
    method: 'get'
  })
}

// 根据Type分页查询
export function listPageDictItemByWhere(data) {
  return axios({
    url: api.listPageDictItemByWhere,
    method: 'get',
    params: data
  })
}

// 新增字典项
export function insertDictItem(data) {
  return axios({
    url: api.insertDictItem,
    method: 'post',
    data: data
  })
}

// 根据ID更新字典项
export function updateDictItemById(id, data) {
  return axios({
    url: api.updateDictItemById({id: id}),
    method: 'put',
    data: data
  })
}

// 根据IDS删除字典项
export function deleteDictItemByIds(ids) {
  return axios({
    url: api.deleteDictItemByIds,
    method: 'delete',
    data: ids
  })
}