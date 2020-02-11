import request from '@/utils/request'

// 获取站点字典
export const listDictionarys = () => {
  return request({
    url: '/sys/sys/dict/list',
    method: 'get'
  })
}