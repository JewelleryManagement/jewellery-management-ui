import {
  fetchUsers,
  fetchResourcePerUser,
  postResourceAvailability
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    usersResources: {},
    isSorting: false,
    sortingWheel: false,
    resourceAvailabilityColumns: [{ key: "quantity", title: "Quantity" }],
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    toggleSorting(state) {
      state.isSorting = !state.isSorting;
    },
    toggleSortingWheel(state) {
      state.sortingWheel = !state.sortingWheel
      setTimeout(() => {
        state.sortingWheel = false
      }, 100);
    },
    setUsersResources(state, usersResources) {
      state.usersResources = usersResources;
    },
    setAllResourcesByUsers(state, usersResources) {
      state.allResourcesByUser.push(usersResources);
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      const res = await fetchUsers();
      commit("setUsers", res);
    },
    toggleSorting({ commit, state }) {
      commit("toggleSorting"); 
      commit("toggleSortingWheel"); 

    },
    async fetchResourcesPerUser({ commit }, userId) {
      const res = await fetchResourcePerUser(userId);
      commit("setUsersResources", res);
    },
    async fetchResourcesByUser({ commit }, userId) {
      return await fetchResourcePerUser(userId);
    },
    async postResourcePerUser({ commit }, data) {
      await postResourceAvailability(data);
    },
  },
  getters: {
    getColumns: (state, getters, rootState, rootGetters) => [
      rootState.resources.tableColumnRemoveQuantity,
      ...state.resourceAvailabilityColumns,
      ...rootState.resources.tableColumns,
    ],
    allUsers(state) {
      return state.users;
    },
    getUserById(state,id) {
      return state.users.find(user => user.id === id)
    },
    getUserResources(state) {
      return state.usersResources;
    },
    sortingWheel: (state) =>  state.sortingWheel,
    sortedUsers(state) {
      if (state.isSorting) {
        return [...state.users].sort((a,b) => {
          return a.name.localeCompare(b.name)
        });
      }
      return state.users;
    },
    isSorting(state) {
      return state.isSorting;
    },
  },
};
