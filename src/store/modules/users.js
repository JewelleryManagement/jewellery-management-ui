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
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "firstName", title: "First Name" },
      { key: "lastName", title: "Last Name" },
      { key: "email", title: "Email" },
      { key: "address", title: "Address", align: " d-none"  },
      { key: "phone", title: "Phone", align: " d-none"  },
      { key: "phone2", title: "Phone2", align: " d-none"  },
      { key: "birthDate", title: "Birth Date", align: " d-none"  },
      { key: "note", title: "Note" },
      { key: "role", title: "Role" },
    ],
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
      console.log(res);
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
      rootState.resources.tableColumnTransferQuantity,
      rootState.resources.tableColumnQuantity,
      ...rootState.resources.tableColumns,
    ],
    getTableColumns: (state) => {
      return state.tableColumns;
    },
    allUsers(state) {
      return state.users;
    },
    getUserById: (state) => (id) => state.users.find((user) => user.id === id),
    getUserResources(state) {
      return state.usersResources.resourcesAndQuantities.map(
        (resourceQuantity) => {
          return {
            quantity: resourceQuantity.quantity,
            ...resourceQuantity.resource,
          };
        }
      );
    },
  },
};
