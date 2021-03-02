// 部门
import { listDeptByWhere } from '@/api/dept'

const dept = {
  namespaced: true,

  state: {},
  
  mutations: {},

  actions: {

    // 根据Where条件进行查询
    ListByWhere({ commit }, data) {
      return new Promise((resolve, reject) => {
        listDeptByWhere(data).then(res => {
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
    }
  }

}

export default dept