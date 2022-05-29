const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 全局计算属性方便调用
  username: state => state.user.userInfo.username,
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
