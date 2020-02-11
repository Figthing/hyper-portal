import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/***/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    meta: { title: '首页', icon: 'dashboard' }
  },

  /* 个人中心 */
  {
    path: '/user',
    redirect: '/user/index',
    component: Layout,
    hidden: true,
    children: [{
      name: 'user',
      path: 'index',
      component: () => import('@/views/user/index'),
      meta: { title: '个人中心', icon: '' }
    }]
  },

  { path: '/404', component: () => import('@/views/404'), hidden: true }
]

/* 动态路由 */
export const asyncRoutes = [
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {

  store.dispatch('permission/ClearRoutes')

  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
