import api from './index'
import { axios } from '@/utils/request'

// 根据Where获取部门
export function listDeptByWhere(data) {
    return axios({
      url: api.listDeptByWhere,
      method: 'get',
      params: data
    })
  }