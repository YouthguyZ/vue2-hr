import router, { asyncRoutes } from './router'
import store from '@/store'
// 导入进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from './utils/get-page-title'

// 创建白名单 白名单：未登录也可以去访问的网页
const whiteList = ['/login', '/404']

// 配置全局路由守卫
router.beforeEach(async(to, from, next) => {
  // 是否有token
  const token = store.state.user.token
  if (token) {
    // 已登录
    console.log(store.state.user.userInfo.userId)
    // 优化ajax请求发送 如果有userinfo信息 就不需要发请求获取个人信息
    if (!store.state.user.userInfo.userId) {
      // 调用 actions 获取用户信息加 await 获取结果后再跳转
      const res = await store.dispatch('user/getProfile')
      console.log(res)
      console.log(asyncRoutes)
      // 过滤当前有的权限
      const fifterRouter = asyncRoutes.filter(item => {
        if (res.roles.menus.includes(item.children[0].name)) {
          return true
        }
      })
      // 兜底动态路由 404
      fifterRouter.push({ path: '*', redirect: '/404', hidden: true })
      // 改写成动态添加的方式
      // router.addRoutes(asyncRoutes) 用户可以访问添加的路由 左侧菜单栏会消失
      router.addRoutes(fifterRouter)
      // 将动路由存到 vuex 中 就可以看到左侧菜单栏
      // store.commit('menu/updateRouterList', asyncRoutes)
      store.commit('menu/updateRouterList', fifterRouter)
      // 解决刷新出现的白屏bug
      console.log(1)
      next({
        ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
        replace: true // 重进一次, 不保留重复历史
      })
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

// 可以写多个前置守卫 写不同的功能 隔离开
router.beforeEach((to, from, next) => {
  // 动态设置标题切换
  document.title = getPageTitle(to.meta.title)
  next()
})

// 后置路由守卫
router.afterEach((to, from) => {
  // 结束进度条
  NProgress.done()
  // // 动态设置标题
  // document.title = getPageTitle(to.meta.title)
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
