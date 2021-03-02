import Vue from 'vue'
import { login, getInfo, getCurrentUserPermission, updateInfo, updatePass, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  namespaced: true,

  state: {
    token: '',
    id: '',
    name: '',
    welcome: '',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    roles: [],
    info: {},
    permission: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },  
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSION: (state, permission) => {
      state.permission = permission
    }
  },

  getters: {

    // 获取用户信息
    getInfo (state) {
      return state.info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          const result = res.data
          Vue.ls.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    },

    // 获取当前登录用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {

          const { code, data } = res

          if (code === undefined || code !== '0') {
            reject(code)
            return
          }

          commit('SET_ROLES', ['suppper'])
          commit('SET_INFO', data)
          commit('SET_NAME', { name: data.operAccount, welcome: welcome() })
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },

    // 获取当前登录用户权限
    GetUserPermission() {
      return new Promise((resolve, reject) => {
        getCurrentUserPermission().then(res => {
          const { code, data } = res

          if (code === undefined || code !== '0') {
            reject(code)
            return
          }

          resolve(data)
        }).catch((err) => {
          reject(code)
        })
      })
    },

    // 更新当前登录用户资料
    UpdateUserInfo({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateInfo(data).then(res => {
          const { code } = res

          if (code === undefined || code !== '0') {
            reject(code)
            return
          }

          resolve(code)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 修改密码
    UpdateUserPass({ commit }, data) {
      return new Promise((resolve, reject) => {
        updatePass(data).then(res => {
          const { code } = res

          if (code === undefined || code !== '0') {
            reject(code)
            return
          }

          resolve(code)
        }).catch(err => {
          reject(err)
        })
      })
    }

  }
}

export default user
