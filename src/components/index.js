// 引入工具组件
import PageTools from '@/components/PageTools'
// 引入组件花裤衩excel导出处理的
import UploadExcel from '@/components/UploadExcel'
// 全局注册uploadimg
import UploadImg from '@/components/UploadImg'
// 全局注册 头像图片
import ImageHolder from '@/components/ImageHolder'

// 1. Vue.use 可以接收一个对象，Vue.use(obj)
// 2. 对象obj中需要提供一个 **install** 函数
// 3. 在 Vue.use(obj) 时，会自动调用该 install 函数，并传入 Vue构造器
export default {
  install(Vue) {
    // console.log('install.....', Vue)
    Vue.component(PageTools.name, PageTools)
    // 导出excel
    Vue.component(UploadExcel.name, UploadExcel)
    // 头像组件
    Vue.component(UploadImg.name, UploadImg)
    // 全局头像
    Vue.component(ImageHolder.name, ImageHolder)
  }
}

