import {
  fetchUsers,
  fetchResourcePerUser,
  postResourceAvailability,
  postUser,
  updateUser,
  fetchPurchasedResourcePerUser,
  fetchUsersByOrganization,
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    usersResources: [],
    purchasedResources: [],
    baseColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "firstName", title: "First Name" },
      { key: "lastName", title: "Last Name" },
      { key: "email", title: "Email" },
    ],
    additionalColumns: [
      { key: "address", title: "Address", align: " d-none" },
      { key: "phone", title: "Phone", align: " d-none" },
      { key: "phone2", title: "Phone2", align: " d-none" },
      { key: "birthDate", title: "Birth Date", align: " d-none" },
      { key: "note", title: "Note" },
      { key: "role", title: "Role" },
    ],
    tableColumnEdit: { key: "edit", title: "Edit", slot: "edit" },
    tableColumnDelete: { key: "delete", title: "Delete", slot: "delete" },
    tableColumnPermissions: {
      key: "permissions",
      title: "Permissions",
      slot: "permissions",
    },
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setUsersResources(state, usersResources) {
      state.usersResources = usersResources;
    },
    setPurchasedResources(state, usersResources) {
      state.purchasedResources = usersResources;
    },
    setAllResourcesByUsers(state, usersResources) {
      state.allResourcesByUser.push(usersResources);
    },
  },
  actions: {
    async fetchUsersByOrganization({ commit }, organizationId) {
      return await fetchUsersByOrganization(organizationId);
    },
    async fetchUsers({ commit }) {
      const res = await fetchUsers();
      commit("setUsers", res);
    },
    async createUser({ commit }, userData) {
      return await postUser(userData);
    },
    async updateUser({ commit }, { userId, data }) {
      return await updateUser(userId, data);
    },
    async fetchResourcesForUser({ commit }, userId) {
      const res = await fetchResourcePerUser(userId);
      commit("setUsersResources", res);
      return res;
    },
    async fetchPurchasedResourcesPerUser({ commit }, userId) {
      const res = await fetchPurchasedResourcePerUser(userId);
      commit("setPurchasedResources", res);
    },
  },
  getters: {
    getOrganizationColumns: (state) => [
      ...state.baseColumns,
      state.tableColumnPermissions,
      state.tableColumnEdit,
      state.tableColumnDelete,
    ],
    getTableColumnsWithEdit: (state) => {
      return [
        ...state.baseColumns,
        ...state.additionalColumns,
        state.tableColumnEdit,
      ];
    },
    getTableColumnsWithQuantity: (state, getters, rootState, rootGetters) => {
      return [
        rootState.resources.tableColumnQuantity,
        ...rootState.resources.tableColumns,
      ];
    },
    getAllUsers(state) {
      return state.users;
    },
    getUserById: (state) => (id) => state.users.find((user) => user.id === id),
    getPurchasedResources(state) {
      return state.purchasedResources?.map((resource) => {
        return {
          quantity: resource.resourceAndQuantity.quantity,
          ...resource.resourceAndQuantity.resource,
        };
      });
    },
    getUserResources(state) {
      return state.usersResources?.resourcesAndQuantities?.map(
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
