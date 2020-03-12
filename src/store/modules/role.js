// 角色管理
import { listRoles, listPermissionByRoleId, deleteRole, insertRole, updateRole, updateRolePermission } from '@/api/role'

const role = {
  namespaced: true,

  state: {
    dict: {}
  },

  mutations: {
  },

  actions: {
    // 查询角色
    ListRoles ({ commit }, where) {
      return new Promise((resolve, reject) => {
        listRoles(where).then(res => {
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

    // 根据角色获取权限
    ListPermissionByRoleId({ commit }, roleId) {
      return new Promise((resolve, reject) => {
        listPermissionByRoleId(roleId).then(res => {
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

    // 删除角色
    DeleteRoles ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteRole(data).then(res => {
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

    // 新增角色
    InsertRole({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertRole(data).then(res => {
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

    // 更新角色
    UpdateRole({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateRole(data.id, data).then(res => {
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

    // 更新角色权限
    UpdateRolePermission({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateRolePermission(data.id, data.permission).then(res => {
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

export default role
