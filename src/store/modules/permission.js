// 权限
import { listRouters } from '@/api/user'
import { deepClone } from '@/utils/index'
import { constantRoutes } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    routes: [],
    addRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  REST_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  async GenerateRoutes({ commit }, user) {

    return new Promise(resolve => {
      let accessedRoutes

      listRouters().then(res => {
        const accessedRoutes = filterAsyncRouter(res.data.data)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })       
    })
  },

  ClearRoutes({ commit }) {
    commit('REST_STATE')
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {        
        route.component = Layout        
      } else {
        route.component = loadView(route.component)
      }
    }

    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}