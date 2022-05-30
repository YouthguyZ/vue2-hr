import axios from 'axios'
// 导入store
import store from '@/store'
// 导入router
import router from '@/router'

// create an axios instance
const service = axios.create({
  // baseURL: 生产环境'http://ihrm-java.itheima.net',开发环境http://localhost:3000
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  // console.log('000000', token)
  if (token) {
    // 配置请求头token bearer
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  // console.log('响应成功', response)
  if (!response.data.success) {
    // promise失败对象 手动抛出异常
    return Promise.reject(response.data)
  }
  // 数据脱壳 后面ajax使用res时不用再结构
  return response.data
}, function(error) {
  console.dir(error)
  // 对响应错误做点什么
  if (error.response.data.code === 10002) {
    // 退出登录
    store.dispatch('user/logout')
    // console.log(location.hash)=> #/form/index
    // 页面跳转
    router.push({
      path: '/login',
      query: {
        // this.$route.fullPath  =>  router.currentRoute.fullPath
        // console.log(router.currentRoute.fullPath)
        // console.log(location.hash)
        return_url: location.hash.substring(1)
      }
    })
  }
  return Promise.reject(error)
})

export default service
