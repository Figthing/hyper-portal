// 人员管理
import { listManager, getManagerByOperId, insertManager, updateManager, updateManagerStatus, resetManagerPass, deleteManager } from '@/api/manager'

const manager = {
  namespaced: true,

  state: {
    dict: {}
  },
  
  mutations: {
  },
  
  actions: {

    // 根据OperId获取人员详情
    GetManagerByOperId({ commit }, data) {
      return new Promise((resolve, reject) => {
        getManagerByOperId(data).then(res => {
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

    // 人员列表
    ListManager({ commit }, where) {
      return new Promise((resolve, reject) => {
        listManager(where).then(res => {
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

    // 新增人员
    InsertManager({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertManager(data).then(res => {
          const { code } = res
        
          if (code === '0') {
            resolve(code)
            return
          }
        
          reject(code)
        }).catch(err => {
          reject(err)
        })
      })
    },
    
    // 更新人员
    UpdateManager({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateManager(data.id, data).then(res => {
          const { code } = res
        
          if (code === '0') {
            resolve(code)
            return
          }
        
          reject(code)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 重置人员密码
    ResetManagerPass({ commit }, data) {
      return new Promise((resolve, reject) => {
        resetManagerPass(data.id, data.newPwd).then(res => {
          const { code } = res
        
          if (code === '0') {
            resolve(code)
            return
          }
        
          reject(code)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 变更人员状态
    UpdateManagerStatus({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateManagerStatus(data.id, data.status).then(res => {
          const { code } = res
        
          if (code === '0') {
            resolve(code)
            return
          }
        
          reject(code)
        }).catch(err => {
          reject(err)
        })
      })      
    },

    // 删除人员
    DeleteManager ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteManager(data).then(res => {
          const { code } = res

          if (code === '0') {
            resolve(code)
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

export default manager
