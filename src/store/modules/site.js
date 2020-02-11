// 站点
import { listDictionarys } from '@/api/site'

const state = {
  dict: {}
}

const mutations = {
  SET_DICT: (state, dict) => {
    state.dict = dict
  }
}

const actions = {

  // 站点字典
  listDictionarys({ commit }) {
    return new Promise((resolve, reject) => {
      listDictionarys().then(response => {
        const data = response.data.data;

        if (0 >= data.length) {
          return;
        }

        let tmpData = {};
        for(var item in data) {
          tmpData[data[item]['dictKey']] = data[item]['dictValue']
        }

        commit('SET_DICT', tmpData)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}