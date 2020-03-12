// 字典配置
import { listPageDictByWhere, insertDict, updateDictById, deleteByIds } from '@/api/dict'

const dict = {
  namespaced: true,

  state: {},

  mutations: {},

  actions: {

    // 根据条件进行分页查询
    ListPageByWhere({ commit }, data) {
      return new Promise((resolve, reject) => {
        listPageDictByWhere(data).then(res => {
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

    // 新增字典
    InsertDict({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertDict(data).then(res => {
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

    // 根据ID更新字典
    UpdateDictById({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateDictById(data.id, data).then(res => {
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

    // 根据IDS删除字典
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
    }
  }

}

export default dict
