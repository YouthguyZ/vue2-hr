// 引入工具组件
import PageTools from '@/components/PageTools'

// 1. Vue.use 可以接收一个对象，Vue.use(obj)
// 2. 对象obj中需要提供一个 **install** 函数
// 3. 在 Vue.use(obj) 时，会自动调用该 install 函数，并传入 Vue构造器
export default {
  install(Vue) {
    // console.log('install.....', Vue)
    Vue.component(PageTools.name, PageTools)
  }
}

