import { login } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    // 持久化存储token
    token: getToken() || ''
  },
  mutations: {
    // 参数1.state
    // 参数2.payload
    updateToken(state, token) {
      // 存储token
      state.token = token
      // 持久化存储token到cookie
      setToken(token)
    }
  },
  actions: {
    async userLogin(context, loginFrom) {
      const res = await login(loginFrom)
      console.log(res)
      context.commit('updateToken', res.data)
      return res
    }

  },
  getters: {}

}
