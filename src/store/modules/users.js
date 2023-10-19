import {
  fetchUsers,
  fetchResourcePerUser,
  postResourceAvailability,
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    usersResources: {},
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
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
    async fetchResourcesForUser({ commit }, userId) {
      const res = await fetchResourcePerUser(userId);
      commit("setUsersResources", res);
    },
    async postResourcesToUser({ commit }, data) {
      await postResourceAvailability(data);
    },
  },
  getters: {
    getColumns: (state, getters, rootState, rootGetters) => [
      rootState.resources.tableColumnRemoveQuantity,
      rootState.resources.tableColumnQuantity,
      ...rootState.resources.tableColumns,
    ],
    allUsers(state) {
      return state.users;
    },
    getUserById: (state) => (id) => state.users.find((user) => user.id === id),
    getUserResources(state) {
      const resourcesByUser = state.usersResources
      const resources = []
      for (let i = 0; i < resourcesByUser.resourcesAndQuantities.length; i++) {
        let quantity = resourcesByUser.resourcesAndQuantities[i].quantity;
        let resource = resourcesByUser.resourcesAndQuantities[i].resource;
        resource.quantity = quantity;
        resources.push(resource);
      }
      return resources;
    },
  },
};
