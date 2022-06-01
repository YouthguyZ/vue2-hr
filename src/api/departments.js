// request=>axiso 导入
import request from '@/utils/request'

export function getDepartmentsList() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
