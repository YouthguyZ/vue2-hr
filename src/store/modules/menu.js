// 导入静态路由表
import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...constantRoutes]
  },
  mutations: {
    updateRouterList(state, list) {
      state.menuList = [...constantRoutes, ...list]
    }
  }

}
