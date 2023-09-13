import {
  fetchUsers,
  fetchResourcePerUser,
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    usersResources: {},
    isSorting: false,
    isBeingSorted: false,
    isAscending: true,
    resourceAvailabilityColumns: [{ key: "quantity", title: "Quantity" }],
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setUsersResources(state, usersResources) {
      state.usersResources = usersResources;
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
    async fetchResourcesPerUser({ commit }, userId) {
      const res = await fetchResourcePerUser(userId);
      commit("setUsersResources", res);
    },
  },
  getters: {
    getColumns: (state, getters, rootState, rootGetters) => [
      ...state.resourceAvailabilityColumns,
      ...rootGetters["resources/getColumns"],
    ],
    isSorting(state) {
      return state.isSorting;
    },
    isBeingSorted(state) {
      return state.isBeingSorted;
    },
    allUsers(state) {
      return state.users;
    },
    getUserResources(state) {
      return state.usersResources;
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
