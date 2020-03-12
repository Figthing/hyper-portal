import { template } from 'lodash'

const api = {

  // config
  listConfig: '/sys/config/search',
  updateConfigById: template('/sys/config/<%= id %>'),

  // dict
  listPageDict: '/sys/dict/search',
  insertDict: '/sys/dict',
  updateDictById: template('/sys/dict/<%= id %>'),
  deleteByIds: '/sys/dict',

  // syslog
  listSysLog: '/sys/logs/search',

  // dictItem
  listDictItemByType: template('/sys/dict/<%= type %>/item'),
  listPageDictItemByWhere: '/sys/dict/item',
  insertDictItem: '/sys/dict/item',
  updateDictItemById: template('/sys/dict/item/<%= id %>'),
  deleteDictItemByIds: '/sys/dict/item',

  // login
  login: '/uaa/sso/login',
  logout: '/uaa/sso/logout',
  getOperInfo: '/upms/oper/detail',
  getOperNav: '/upms/oper/routes',
  getOperPermission: '/upms/oper/permission',
  updateOperInfo: '/upms/oper/info',
  updateOperPass: '/upms/oper/pass',

  // role
  geRolePermission: template('/upms/role/<%= id %>/permission'),
  listRoles: '/upms/role/search',
  deleteRole: '/upms/role',
  insertRole: '/upms/role',
  updateRole: template('/upms/role/<%= id %>'),
  updateRolePermission: template('/upms/role/<%= id %>/permission'),

  // manager
  getManagerByOperId: template('/upms/manager/<%= id %>'),
  listManager: '/upms/manager/search',
  listRoleByOperId: template('/upms/manager/<%= id %>/role'),
  insertManager: '/upms/manager',
  deleteManager: '/upms/manager',
  updateManager: template('/upms/manager/<%= id %>'),
  updateManagerStatus: template('/upms/manager/<%= id %>/status'),
  resetManagerPass: template('/upms/manager/<%= id %>/pass'),
}
export default api
