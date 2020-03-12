// 参数配置
import { listSysLog } from '@/api/syslog'

const syslog = {
  namespaced: true,

  state: {
    list: []
  },

  mutations: {
    SET_CONFIG: (state, config) => {
      state.list = config
    }
  },

  getters: {
  },

  actions: {

    // 根据条件查询系统日志
    ListPageByWhere({ commit }, where) {
      return new Promise((resolve, reject) => {
        listSysLog(where).then(res => {
          const { code, data } = res
        
          if (code === '0') {
            resolve(data)
            return
          }
        
          reject(code)
        }).catch(err => {
          reject(err)
        })
      })
    },

  }

}

export default syslog
