import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalLoading: false
  },
  mutations: {
    setLoading (state, status) {
      state.globalLoading = status
    }
  },
  actions: {
    updateLoading ({ commit }, status) {
      commit('setLoading', status)
    }
  },
  modules: {
  }
})
