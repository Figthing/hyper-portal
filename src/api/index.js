import { template } from 'lodash'

const api = {

  // config
  listConfig: '/sys/config/search',
  updateConfigById: template('/sys/config/<%= id %>'),

  // dict
  listPageDict: '/sys/dict/search',
  insertDict: '/sys/dict',
  updateDictById: template('/sys/dict/<%= id %>'),
  deleteDictByIds: '/sys/dict',

  // dictItem
  listDictItemByType: template('/sys/dict/<%= type %>/item'),
  listPageDictItemByWhere: '/sys/dict/item',
  insertDictItem: '/sys/dict/item',
  updateDictItemById: template('/sys/dict/item/<%= id %>'),
  deleteDictItemByIds: '/sys/dict/item',

  // syslog
  listSysLog: '/sys/logs/search',

  // 当前用户模块
  login: '/auth/sso/login',
  logout: '/auth/sso/logout',
  getOperInfo: '/upms/oper/detail',
  getOperNav: '/upms/permission',
  getOperPermission: '/upms/oper/permission',
  updateOperInfo: '/upms/oper/detail',
  updateOperPass: '/upms/oper/pass',

  // role
  geRolePermission: template('/upms/role/<%= id %>/permission'),
  listRoles: '/upms/role/search',
  deleteRole: '/upms/role',
  insertRole: '/upms/role',
  updateRole: template('/upms/role/<%= id %>'),
  updateRolePermission: template('/upms/role/<%= id %>/permission'),

  // 用户管理模块
  getManagerByOperId: template('/upms/manager/<%= id %>'),
  listManager: '/upms/oper/mgr',
  listRoleByOperId: template('/upms/manager/<%= id %>/role'),
  insertManager: '/upms/manager',
  deleteManager: '/upms/manager',
  updateManager: template('/upms/manager/<%= id %>'),
  updateManagerStatus: template('/upms/manager/<%= id %>/status'),
  resetManagerPass: template('/upms/manager/<%= id %>/pass'),

  // job
  listPageJobByWhere: '/upms/job/search',
  deleteJobByIds: '/upms/job',
  insertJob: '/upms/job',

  // dept
  listDeptByWhere: '/upms/dept'

}
export default api
