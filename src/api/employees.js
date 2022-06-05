// request=>axiso 导入
import request from '@/utils/request'

// 获取员工简单列表
export function getEmployeesList() {
  return request({
    method: 'get',
    url: '/sys/user/simple'
  })
}
// 获取员工信息
export function getEmployees(params) {
  return request({
    method: 'get',
    url: '/sys/user',
    params
  })
}
// 根据id删除员工信息
export function delEmployees(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}
