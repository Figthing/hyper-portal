import api from './index'
import { axios } from '@/utils/request'

// 获取系统日志
export function listSysLog(where) {
	return axios({
		url: api.listSysLog,
		method: 'get',
		params: where
	})
}