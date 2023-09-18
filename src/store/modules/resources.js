import { reactive } from "vue";
import {
  fetchResources,
  postResources,
  removeResource,
  updateResource,
  removeResourceQuantity
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: reactive({
    resources: [],
    resourceDetails: {},
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
      { key: "description", title: "Description" },
    ],
    tableColumnDelete: { key: "delete", title: "", slot: "delete" },
    tableColumnEdit: { key: "edit", title: "", slot: "edit" },
    tableColumnAdd: { key: "add", title: "", slot: "add" },
    tableColumnRemoveQuantity: { key: "remove", title: "", slot: "remove" },
  }),
  mutations: {
    setResources(state, resources) {
      state.resources = resources;
    },
    createResource(state, payload) {
      state.resources.push(payload);
    },
    removeResource(state, id) {
      state.resources = state.resources.filter(
        (resource) => resource.id !== id
      );
    },
    setResourceDetails(state, payload) {
      state.resourceDetails = payload;
    },
    updateResource(state, updatedResource) {
      const index = state.resources.findIndex(
        (resource) => resource.id === updatedResource.id
      );
      if (index !== -1) state.resources[index] = updatedResource;
    },
  },
  actions: {
    async fetchResources({ commit }) {
      const res = await fetchResources();
      commit("setResources", res);
    },
    async createResource({ commit }, formData) {
      const res = await postResources(formData);
      commit("createResource", res);
    },
    async removeResource({ commit }, id) {
      await removeResource(id);
      commit("removeResource", id);
    },
    setResourceDetails({ commit }, data) {
      commit("setResourceDetails", data);
    },
    async updateResource({ commit }, { id, ...resourceWithoutId }) {
      const updatedResource = await updateResource(id, resourceWithoutId);
      commit("updateResource", updatedResource);
    },
    async removeQuantityFromResource({commit}, data) {
      await removeResourceQuantity(data.userId, data.resourceId, data.quantityNumber)
    }
  },
  getters: {
    allResources: (state) => state.resources,
    getColumns: (state) => [
      ...state.tableColumns,
      state.tableColumnDelete,
      state.tableColumnEdit,
      state.tableColumnAdd,
    ],
    getResourceById: (state) => (id) =>
      state.resources.find((resource) => resource.id === id),
    getResourceDetails: (state) => state.resourceDetails,
  },
};
