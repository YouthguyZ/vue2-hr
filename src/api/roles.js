// request=>axiso 导入
import request from '@/utils/request'

export function getRoles(params) {
  return request({
    method: 'get',
    url: '/sys/role',
    params
  })
}
// 根据id删除信息
export function delRolesById(id) {
  return request({
    method: 'delete',
    url: '/sys/role/' + id
  })
}
// 添加角色
export function addRoles(data) {
  return request({
    method: 'post',
    url: '/sys/role',
    data
  })
}
// 编辑角色
export function updateRoles(data) {
  return request({
    method: 'put',
    url: '/sys/role/' + data.id,
    data
  })
}
