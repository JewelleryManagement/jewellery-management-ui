import { postUserLogin } from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user;
      state.token = payload.token;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    async login({ commit }, payload) {
      const user = await postUserLogin(payload);
      commit("setUser", user);
      return user.user;
    },
    logout({ commit }) {
      commit("clearUser");
      localStorage.removeItem("vuex");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
  },
};
