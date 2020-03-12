import api from './index'
import { axios } from '@/utils/request'

// 获取参数配置
export function listConfig() {
  return axios({
    url: api.listConfig,
    method: 'get',
    params: {
        pageNum: 1,
        pageSize: 100
    }
  })
}

// 根据ID更新参数
export function updateById(id, data) {
  return axios({
    url: api.updateConfigById({id: id}),
    method: 'put',
    data: data
  })
}