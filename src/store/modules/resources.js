import { reactive } from "vue";
import { fetchResources } from "@/services/HttpClientService.js";

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
    ],
  }),
  mutations: {
    setResources(state, resources) {
      state.resources = resources;
    },
  },
  actions: {
    async fetchResources({ commit }) {
      const res = await fetchResources();
      commit("setResources", res);
    },
  },
  getters: {
    allResources: (state) => state.resources,
    getColumns: (state) => state.tableColumns,
  },
};
