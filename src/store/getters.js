const getters = {
  // 系统
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  multiTab: state => state.app.multiTab,

  // 站点配置
  website: state => state.app.website,

  // 路由
  addRouters: state => state.permission.addRouters,

  // 用户
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
}

export default getters
