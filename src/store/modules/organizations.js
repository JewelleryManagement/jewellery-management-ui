import { fetchOrgs, postOrg } from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    organizations: [],
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
  },
  actions: {
    async fetchOrgs({ commit }) {
      const res = await fetchOrgs();
      commit("setOrgs", res);
    },
    async postOrg({ commit }, data) {
      await postOrg(data);
    },
  },
  getters: {
    allOrganizations: (state) => {
      return state.organizations;
    },
    getColumns: (state) => [...state.tableColumns],
  },
};
