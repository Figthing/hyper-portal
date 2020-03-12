import api from './index'
import { axios } from '@/utils/request'

// 获取角色
export function listRoles(where) {
  return axios({
    url: api.listRoles,
    method: 'get',
    params: where
  })
}

// 删除角色
export function deleteRole(ids) {
  return axios({
    url: api.deleteRole,
    method: 'delete',
    data: ids
  })
}

// 新增角色
export function insertRole(data) {
  return axios({
    url: api.insertRole,
    method: 'post',
    data: data
  })
}

// 更新角色
export function updateRole(id, data) {
  return axios({
    url:  api.updateRole({id: id}),
    method: 'put',
    data: data
  })
}

// 更新角色权限
export function updateRolePermission(id, data) {
  return axios({
    url:  api.updateRolePermission({id: id}),
    method: 'put',
    data: data
  })
}

// 根据角色ID获取权限
export function listPermissionByRoleId(id) {
  return axios({
    url: api.geRolePermission({id: id}),
    method: 'get'
  })
}