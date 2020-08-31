import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'
import getters from './getters'
import state from './state'
import mutations from './mutaions'
import actions from './actions'

const debuger = process.env.NODE_ENV !== 'production'

const store = () => {
  return new Vuex.Store({
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    strict: false,
    plugins: debuger ? [Logger()] : []
  })
}

export default store
