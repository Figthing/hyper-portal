// 岗位配置
import { listPageJobByWhere, deleteByIds, insertJob } from '@/api/job'

const job = {
  namespaced: true,

  state: {},
  
  mutations: {},

  actions: {

    // 根据条件进行分页查询
    ListPageByWhere({ commit }, data) {
      return new Promise((resolve, reject) => {
        listPageJobByWhere(data).then(res => {
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
    // 根据IDS删除岗位
    DeleteByIds({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteByIds(data).then(res => {
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
    // 新增岗位
    InsertJob({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertJob(data).then(res => {
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
    }
  }
  
}

export default job