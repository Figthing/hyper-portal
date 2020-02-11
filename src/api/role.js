import request from '@/utils/request'

// 获取角色列表
export function listRoles(where) {
  return request({
    url: '/upms/role',
    method: 'get',
    params: where
  })
}

// 添加角色
export function insertRole(data) {
  return request({
    url: '/upms/role',
    method: 'post',
    data: data
  })
}

// 编辑角色
export function updateRole(id, data) {
  return request({
    url: '/upms/role/'+id,
    method: 'put',
    data: data
  })
}

// 批量删除角色
export function deleteRole(ids) {
  return request({
    url: '/upms/role/ids',
    method: 'delete',
    data: ids
  })
}

// 根据角色ID获取菜单
export const listMenusByRoleId = (id) => {
  return request({
    url: '/upms/role/'+id+'/menu',
    method: 'get'
  })
}