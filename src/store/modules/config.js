// 参数配置
import { listConfig, updateById } from '@/api/config'

const config = {
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

    // 获取配置列表
    getList (state) {
      return state.list
    }
  },

  actions: {

    // 根据条件获取参数配置
    ListPageByWhere({ commit }) {
      return new Promise((resolve, reject) => {
        listConfig().then(res => {
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

    // 获取参数配置（用于配置）
    ListSysConfig ({ commit }) {
      return new Promise((resolve, reject) => {
        listConfig().then(res => {
          const { data } = res

          if (data.total <= 0) {
            return
          }

          commit('SET_CONFIG', data.list)
          resolve(data.list)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 根据ID更新
    UpdateById({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateById(data.id, data).then(res => {
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

export default config
