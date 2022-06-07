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
// 添加员工
export function addEmployees(data) {
  return request({
    method: 'post',
    url: `/sys/user`,
    data
  })
}
// 导入excel文件员工
/**
 * @description: 导入excel
 * @param {*} data
 * @return {*}
 */
export function importEmployee(data) {
  return request({
    method: 'post',
    url: `/sys/user/batch`,
    data
  })
}
// 获取用户信息
export function getUserDetailById(id) {
  return request({
    method: 'get',
    url: `/sys/user/${id}`
  })
}

// 修改用户信息
export function updateUserDetailById(data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}
