// request=>axiso 导入
import request from '@/utils/request'

export function getEmployeesList() {
  return request({
    method: 'get',
    url: '/sys/user/simple'
  })
}
