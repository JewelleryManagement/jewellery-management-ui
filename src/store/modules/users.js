import { fetchUsers } from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    isSorting: false,
    isBeingSorted: false,
    isAscending: true,
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setIsSorting(state, isSorting) {
      state.isSorting = isSorting;
    },
    setIsBeingSorted(state, isBeingSorted) {
      state.isBeingSorted = isBeingSorted;
    },
    setIsAscending(state, isAscending) {
      state.isAscending = isAscending;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      const res = await fetchUsers();
      commit("setUsers", res);
    },
    toggleSorting({ commit, state }) {
      commit("setIsSorting", true);
      commit("setIsBeingSorted", true);
      setTimeout(() => {
        // commit("setIsAscending", !state.isAscending);
        commit("setIsSorting", false);
      }, 100);
    },
  },
  getters: {
    isSorting(state) {
      return state.isSorting;
    },
    isBeingSorted(state) {
      return state.isBeingSorted;
    },
    allUsers(state) {
      return state.users;
    },
    getUserById: (state) => (userId) => {
      return state.users.find((user) => user.id === userId);
    },
    sortedUsers(state) {
      return state.users.slice().sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (state.isAscending) {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
        }
        return 0;
      });
    },
  },
};
