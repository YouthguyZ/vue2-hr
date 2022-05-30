import { getDetailByid, getUserInfo, login } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    // 持久化存储token
    token: getToken() || '',
    userInfo: {}
  },
  mutations: {
    // 参数1.state
    // 参数2.payload
    updateToken(state, token) {
      // 存储token
      state.token = token
      // 持久化存储token到cookie
      setToken(token)
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 清空token
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    // 清楚用户信息
    removeUserInfo(state) {
      state.UserInfo = {}
    }

  },
  actions: {
    async userLogin(context, loginFrom) {
      const res = await login(loginFrom)
      console.log(res)
      context.commit('updateToken', res.data)
      return res
    },
    async getProfile(context) {
      const res = await getUserInfo()
      // console.log(res)
      // 2. 根据用户id（rs.data.userId）再发请求，获取详情（包含头像）
      const info = await getDetailByid(res.data.userId)
      // 把上边获取的两份合并在一起，保存到vuex中 ...扩展运算符
      context.commit('updateUserInfo', { ...res.data, ...info.data })
    },
    logout(context) {
      // 清空token
      context.commit('removeToken')
      // 清楚用户信息
      context.commit('removeUserInfo')
    }

  },
  getters: {}

}
