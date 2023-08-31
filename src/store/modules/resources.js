import { reactive } from "vue";
import {
  fetchResources,
  postResources,
  removeResource,
  updateResource,
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
    removeResource(state, payload) {
      state.resources = state.resources.filter(
        (resource) => resource.id !== payload
      );
    },
    setResourceDetails(state, payload) {
      state.resourceDetails = payload;
    },
    updateFormData(state, data) {
      state.resourceDetails = data;
    },
    updateResource(state, updatedResource) {
      const index = state.resources.findIndex(
        (resource) => resource.id === updatedResource.id
      );
      if (index !== -1) {
        state.resources.splice(index, 1, updatedResource);
      }
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
    async removeResource({ commit }, id) {
      await removeResource(id);
      commit("removeResource", id);
    },
    setResourceDetails({ commit }, data) {
      commit("setResourceDetails", data);
    },
    updateFormData({ commit, state }, newData) {
      commit("updateFormData", newData);
    },
    async updateSomeResource({ commit },  data ) {
      const { id, ...resourceWithoutId } = data;
      const updatedResource = await updateResource(id, resourceWithoutId);
      commit("updateResource", updatedResource);
    },
  },
  getters: {
    allResources: (state) => state.resources,
    getColumns: (state) => state.tableColumns,
    getResourceById: (state) => (id) =>
      state.resources.find((resource) => resource.id === id),
    getResourceDetails: (state) => state.resourceDetails,
  },
};
