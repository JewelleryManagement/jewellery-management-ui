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
    setProducts(state, organizations) {
      state.organizations = organizations;
    },
  },
  actions: {},
  getters: {
    allOrganizations: (state) => {
      return state.organizations;
    },
    getColumns: (state) => [
        ...state.tableColumns,
      ],
  },
};
