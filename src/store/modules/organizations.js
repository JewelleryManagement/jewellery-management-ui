import {
  fetchOrgs,
  postOrg,
  getUserOrganizations,
  getResourceAvailabilityByOrganization,
  getUserOrganizationsByPermission,
  postResourceToOrg,
  removeResourceFromOrg,
  postResourceTranferToOrg
} from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    organizations: [],
    userOrganizations: [],
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "name", title: "Name" },
      { key: "address", title: "Address" },
      { key: "note", title: "Note" },
    ],
  },
  mutations: {
    setOrgs(state, organizations) {
      state.organizations = organizations;
    },
    setUserOrgs(state, orgs) {
      state.userOrganizations = orgs;
    },
  },
  actions: {
    async fetchOrgs({ commit }) {
      const res = await fetchOrgs();
      commit("setOrgs", res);
    },
    async fetchOrganizationResources({ commit }, orgId) {
      return await getResourceAvailabilityByOrganization(orgId);
    },
    async postOrg({ commit }, data) {
      await postOrg(data);
    },
    async fetchUserOrgs({ commit }) {
      const res = await getUserOrganizations();
      commit("setUserOrgs", res);
    },
    async fetchUserOrgsByPermission({ commit }, permission) {
      return await getUserOrganizationsByPermission(permission);
    },
    async postResourceToOrg({ commit }, data) {
      await postResourceToOrg(data);
    },
    async removeResourceFromOrg({ commit }, data) {
      const { organizationId, resourceId, quantity } = data;
      await removeResourceFromOrg(organizationId, resourceId, quantity);
    },
    async transferResourceFromOrg({commit}, data){ 
      await postResourceTranferToOrg(data)
    }
  },
  getters: {
    allOrganizations: (state) => {
      return state.organizations;
    },
    getColumns: (state) => [...state.tableColumns],
    getUserOrgs: (state) => state.userOrganizations,
  },
};
