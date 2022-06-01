// request=>axiso 导入
import request from '@/utils/request'

export function getDepartmentsList() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
// 添加部门
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
// 获取部门详细信息
export function getDepartmentsDetail(id) {
  return request({
    method: 'get',
    url: '/company/department/' + id
  })
}
// 编辑部门详细信息
export function editDepartmentsById(data) {
  return request({
    method: 'put',
    url: '/company/department/' + data.id,
    data
  })
}
