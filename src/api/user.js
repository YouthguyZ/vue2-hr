// request=>axiso 导入
import request from '@/utils/request'

export function login(data) {
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}

export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

export function getDetailByid(id) {
  return request({
    method: 'get',
    url: '/sys/user/' + id
  })
}

export function logout() {

}
