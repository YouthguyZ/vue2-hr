import router from './router'
import store from '@/store'
// 导入进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 创建白名单 白名单：未登录也可以去访问的网页
const whiteList = ['/login', '/404']

// 配置全局路由守卫
router.beforeEach(async(to, from, next) => {
  // 是否有token
  const token = store.state.user.token
  if (token) {
    // 已登录
    // 优化ajax请求发送 如果有userinfo信息 就不需要发请求获取个人信息
    if (!store.state.user.userInfo.userId) {
      // 调用actions 获取用户信息加await 获取结果后再跳转
      await store.dispatch('user/getProfile')
    }
    // 开始进度条
    NProgress.start()
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 未登录
    // 逻辑判断：去的是whiteList直接放行 否则强制去登录页
    // if (to.path === '/login')
    // includes:判断数组中是否包含 指定元素
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
  // next()
})
// 后置路由器
router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
