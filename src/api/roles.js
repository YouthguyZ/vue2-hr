// request=>axiso 导入
import request from '@/utils/request'

export function getRoles(params) {
  return request({
    method: 'get',
    url: '/sys/role',
    params
  })
}
