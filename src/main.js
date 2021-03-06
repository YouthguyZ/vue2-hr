import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 导入国际化语言包
import i18n from '@/lang'

// // 引入工具组件
// import PageTools from '@/components/PageTools'
// // 注册全局组件
// // Vue.component('组件名', 组件对象)
// Vue.component(PageTools.name, PageTools)

// // 1. Vue.use 可以接收一个对象，Vue.use(obj)
// // 2. 对象obj中需要提供一个 **install** 函数
// // 3. 在 Vue.use(obj) 时，会自动调用该 install 函数，并传入 Vue构造器
// const MyPlugin = {
//   install(Vue) {
//     // console.log('install.....', Vue)
//     Vue.component(PageTools.name, PageTools)
//   }
// }
// Vue.use(MyPlugin)
// 导入组件
import MyUi from '@/components'
// 全局注册使用
Vue.use(MyUi)

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局注册 自定义指令
Vue.directive('allow', {
  inserted: function(el, binding) {
    const points = store.state.user.userInfo.roles.points
    // 判断是否有 导出标识 "exprot_excel" 有的话就可以使用导出功能 如果没有就不能导出
    if (!points.includes(binding.value)) {
      // 如果没有这个值就删除这个按钮
      el.remove()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
