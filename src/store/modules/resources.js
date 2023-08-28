import { reactive } from "vue";
import { fetchResources, postResources } from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: reactive({
    resources: [],
    tableColumns: [
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
      { key: "delete", title: "", slot: "delete" },
      { key: "edit", title: "", slot: "edit" },
    ],
  }),
  mutations: {
    setResources(state, resources) {
      state.resources = resources;
    },
    addResources(state, payload) {
      state.resources.push(payload);
    },
  },
  actions: {
    async fetchResources({ commit }) {
      const res = await fetchResources();
      commit("setResources", res);
    },
    async AddResources({ commit }, formData) {
      const res = await postResources(formData);
      commit("addResources", res);
    },
  },
  getters: {
    allResources: (state) => state.resources,
    getColumns: (state) => state.tableColumns,
  },
};
