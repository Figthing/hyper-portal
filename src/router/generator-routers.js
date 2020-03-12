// eslint-disable-next-line
import * as loginService from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 控制台
  'Analysis': () => import('@/views/dashboard/Analysis'),

  // 账号
  'AccountInfo': () => import('@/views/account/settings/AccountInfo'),
  'AccountSettings': () => import('@/views/account/settings/Index'),
  'BaseSettings': () => import('@/views/account/settings/BaseSetting'),
  'SecuritySettings': () => import('@/views/account/settings/Security'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '/',
  component: BasicLayout,
  redirect: '/dashboard',
  meta: {
    title: '首页'
  },
  children: [{
    key: 'Analysis',
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse }
  },
  {
    path: '/account',
    component: RouteView,
    redirect: '/account/center',
    name: 'account',
    meta: { title: '个人页', icon: 'user', show: false, keepAlive: true },
    children: [
      {
        path: '/account/center',
        redirect: '/account/settings/info',
        name: 'accountInfo',
        meta: { title: '个人中心', keepAlive: true }
      },
      {
        key: 'AccountSettings',
        path: '/account/settings',
        name: 'accountSettings',
        meta: { title: '个人设置', hideHeader: true },
        redirect: '/account/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            key: 'AccountInfo',
            path: '/account/settings/info',
            name: 'accountInfo',
            meta: { title: '账号信息' }
          },
          {
            key: 'BaseSettings',
            path: '/account/settings/base',
            name: 'accountBaseSettings',
            meta: { title: '基本设置' }
          },
          {
            key: 'SecuritySettings',
            path: '/account/settings/security',
            name: 'accountSecuritySettings',
            meta: { title: '安全设置', keepAlive: true }
          }
        ]
      }
    ]
  }]
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    loginService.getCurrentUserNav().then(res => {
      console.log('res', res)
      const { data } = res
      const menuNav = []
      for (var i = 0; i < data.length; i++) {
        rootRouter.children.push(data[i])
      }
      menuNav.push(rootRouter)
      console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

export const loadView = (item) => { // 路由懒加载

  const component = item.component

  if (component && component['name'] != undefined) {
    return component
  }

  const view = constantRouterComponents[item.key || component]

  if (view !== undefined) {
    return view
  }

  return () => import(`@/views/${component}`)
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: loadView(item),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      // meta: { title: title, icon: icon || undefined, hiddenHeaderContent: hiddenHeaderContent, target: target, permission: item.name }
      meta: { title: title, icon: icon || undefined, hiddenHeaderContent: true, target: target, permission: item.name }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
