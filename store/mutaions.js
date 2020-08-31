export default {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_COLLAPSE: (state) => {
    state.isCollapse = !state.isCollapse
  }
}
