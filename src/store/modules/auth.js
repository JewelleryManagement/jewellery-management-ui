export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async login({commit}, payload) {
      commit('setUser', payload)
      localStorage.setItem("userAuth", payload.email);
      return 'ok'
    },
    logout({commit}) {
      localStorage.removeItem("userAuth");
      commit('setUser', null)
    }
  },
  getters: {
    isUserAuth(state) {
      return state.user
    },
    isAuthenticated(state) {
      return !!state.user
    }
  },
};
