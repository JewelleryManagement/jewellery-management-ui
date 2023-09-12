import { fetchUsers } from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    users: [],
    isSorting: false,
    isBeingSorted: false,
    isAscending: true,
    tableColumns: [
      { key: "quantity", title: "Quantity" },
      { key: "clazz", title: "Resource Type" },
      { key: "color", title: "Color" },
      { key: "quality", title: "Quality" },
      { key: "quantityType", title: "Quantity Type" },
      { key: "shape", title: "Shape" },
      { key: "size", title: "Size" },
      { key: "type", title: "Type" },
      { key: "purity", title: "Purity" },
      { key: "plating", title: "Plating" },
      { key: "carat", title: "Carat" },
      { key: "cut", title: "Cut" },
      { key: "dimensionX", title: "dimensionX" },
      { key: "dimensionY", title: "dimensionY" },
      { key: "dimensionZ", title: "dimensionZ" },
      { key: "description", title: "Description" },
      { key: "delete", title: "", slot: "delete" },
      { key: "edit", title: "", slot: "edit" },
    ],
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
    getColumns: (state) => state.tableColumns,
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
