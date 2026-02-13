import {
  fetchUsers,
  postUser,
  updateUser,
  fetchPurchasedResourcePerUser,
  fetchUsersByOrganization,
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    purchasedResources: [],
    baseColumns: [
      { key: "id", title: "Id", align: "d-none" },
      { key: "firstName", title: "First Name" },
      { key: "lastName", title: "Last Name" },
      { key: "email", title: "Email" },
    ],
    additionalColumns: [
      { key: "address", title: "Address" },
      { key: "phone", title: "Phone" },
      { key: "phone2", title: "Phone2" },
      { key: "birthDate", title: "Birth Date" },
      { key: "note", title: "Note" },
      { key: "role", title: "Role" },
    ],
    tableActions: { key: "actions", title: "", slot: "actions" },
    tableColumnPermissions: {
      key: "permissions",
      title: "Permissions",
      slot: "permissions",
    },
    tableColumnOrganizationPermissions: {
      key: "organizationPermissions",
      title: "Permissions",
      slot: "organizationPermissions",
    },
    tableColumnOrganization: {
      key: "organization",
      title: "Organization",
      slot: "organization",
    },
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
  },
  mutations: {
    setUsers(state, users) {
      state.users = users;
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
    async fetchPurchasedResourcesPerUser({ commit }, userId) {
      const res = await fetchPurchasedResourcePerUser(userId);
      commit("setPurchasedResources", res);
    },
  },
  getters: {
    getOrganizationColumns: (state) => [
      ...state.baseColumns,
      state.tableColumnPermissions,
      state.tableActions,
    ],
    getTableColumnsWithActions: (state) => {
      return [
        ...state.baseColumns,
        ...state.additionalColumns,
        state.tableActions,
      ];
    },
    getAllInformationColumns: (state) => [
      ...state.baseColumns,
      ...state.additionalColumns,
    ],
    getBaseColumnsWithPermmisions: (state) => [
      ...state.baseColumns,
      state.tableColumnOrganizationPermissions,
      state.tableColumnOrganization,
    ],
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
        },
      );
    },
    getTableButtons: (state) => state.tableButtons,
  },
};
