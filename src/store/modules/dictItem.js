// 字典项
import { listDictItemByType, listPageDictItemByWhere, insertDictItem, updateDictItemById, deleteDictItemByIds } from '@/api/dictItem'

const dictItem = {
  namespaced: true,

  state: {},

  mutations: {},

  actions: {

    // 根据Type查询
    ListDictItemByType({ commit }, data) {
      return new Promise((resolve, reject) => {
        listDictItemByType(data).then(res => {
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

    // 根据Type分页查询
    ListPageDictItemByWhere({ commit }, data) {
      return new Promise((resolve, reject) => {
        listPageDictItemByWhere(data).then(res => {
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

    // 新增字典项
    InsertDictItem({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertDictItem(data).then(res => {
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

    // 根据ID更新字典项
    UpdateDictItemById({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateDictItemById(data.id, data).then(res => {
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

    // 根据IDS删除字典项
    DeleteDictItemByIds({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteDictItemByIds(data).then(res => {
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

export default dictItem
