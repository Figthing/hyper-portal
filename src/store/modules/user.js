// 用户
import { login, logout} from '@/api/login'
import { getUserInfo, updateUserInfo, updateUserPass } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {

  // 用户登录
  login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login(username, userInfo.password).then(response => {
        const access_token = response.data.data.AccessToken
        commit('SET_TOKEN', access_token)
        setToken(access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  UserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const data = response.data.data
        if (data.roles && data.roles.length > 0) {
          // 角色
          commit('SET_ROLES', data.roles)
        } else {
          reject('getInfo: roles must be a non-null array!')
        }

        // 用户名称
        commit('SET_NAME', data.operName)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 更新用户资料
  updateUserInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateUserInfo(data).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改密码
  updateUserPass({ commit }, data) {
    return new Promise((resolve, reject) => {
      updateUserPass(data.oldPass, data.newPass).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  Logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', '')
        commit('SET_NAME', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

