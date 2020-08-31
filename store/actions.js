import Service from './service'
export default {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.user) {
      const { username, avatar, role } = req.session.user
      commit('SET_USER', { username, avatar, role })
    }
  },
  async logout({ commit }) {
    await Service.logout()
    commit('SET_USER', null)
  },
  togglemenu({ commit }) {
    commit('SET_COLLAPSE')
  },
  async login({ commit }, { username, password }) {
    try {
      const res = await Service.login({ username, password })
      if (res.code === 200) {
        commit('SET_USER', res.data)
        return res
      } else {
        throw new Error('登录失败')
      }
    } catch (error) {
      throw new Error('你来错地方了')
    }
  }
}
