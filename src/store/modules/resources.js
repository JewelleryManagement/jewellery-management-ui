import { reactive } from "vue";
import {
  fetchResources,
  postResources,
  postResourceAvailabilityTransfer,
  removeResource,
  updateResource,
  removeResourceQuantity,
  fetchAvailabilityResourceById,
  fetchQuantityByResourceId,
} from "@/services/HttpClientService.js";

const filterColumnsByKey = (state, keys) => {

  const additionalColumnsLeft = [
    state.tableColumnQuantity
  ]

  const additionalColumnsRight = [
    state.tableColumnDelete,
    state.tableColumnEdit,
    state.tableColumnAdd,
  ];

  const filteredColumns = state.tableColumns.filter((column) => keys.includes(column.key));
  const result = [...additionalColumnsLeft, ...filteredColumns,...additionalColumnsRight];
  
  return result;
};

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
      { key: "pricePerQuantity", title: "Price per quantity" },
      { key: "note", title: "Note" },
      { key: "description", title: "Description" },
    ],
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableColumnDelete: { key: "delete", title: "", slot: "delete" },
    tableColumnEdit: { key: "edit", title: "", slot: "edit" },
    tableColumnAdd: { key: "add", title: "", slot: "add" },
    tableColumnRemoveQuantity: { key: "remove", title: "", slot: "remove" },
    tableColumnTransferQuantity: {
      key: "transfer",
      title: "",
      slot: "transfer",
    },
    tableColumnAddQuantity: {
      key: "addQuantity",
      title: "",
      slot: "addQuantity",
    },
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
      const formattedResponse = Object.values(res).map((item) => ({
        ...item.resource,
        quantity: item.quantity,
      }));
      commit("setResources", formattedResponse);
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
    setResourceForm({ commit }, data) {
      commit("setResourcForm", data);
    },
    async resourceAvailabilityTransfer({ commit }, data) {
      await postResourceAvailabilityTransfer(data);
    },
    async updateResource({ commit }, { id, ...resourceWithoutId }) {
      const updatedResource = await updateResource(id, resourceWithoutId);
      commit("updateResource", updatedResource);
    },
    async removeQuantityFromResource({ commit }, data) {
      await removeResourceQuantity(data.userId, data.resourceId, data.quantity);
    },
    async fetchAvailabilityResourceById({ commit }, resourceId) {
      return await fetchAvailabilityResourceById(resourceId);
    },
    async fetchQuantityByResourceId({ commit }, resourceId) {
      return await fetchQuantityByResourceId(resourceId);
    },
  },
  getters: {
    getTableColumns: (state) => state.tableColumns,
    allResources: (state) => state.resources,
    getColumnsWithQuantity: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
    getColumns: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
      state.tableColumnDelete,
      state.tableColumnEdit,
      state.tableColumnAdd,
    ],
    getAvailabilityUpdateColumns: (state) => [
      state.tableColumnRemoveQuantity,
      state.tableColumnTransferQuantity,
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
    getColumnsForPearl: (state) =>
      filterColumnsByKey(state, [
        "quantity",
        "clazz",
        "type",
        "size",
        "quality",
        "quantityType",
        "color",
        "shape",
        "pricePerQuantity",
        "note",
      ]),
    getColumnsForPreciousStone: (state) =>
      filterColumnsByKey(state, [
        "quantity",
        "clazz",
        "quantityType",
        "size",
        "color",
        "shape",
        "carat",
        "cut",
        "clarity",
        "pricePerQuantity",
        "note",
      ]),
    getColumnsForSemiPreciousStone: (state) =>
      filterColumnsByKey(state, [
        "quantity",
        "clazz",
        "quantityType",
        "size",
        "color",
        "shape",
        "cut",
        "clarity",
        "pricePerQuantity",
        "note",
      ]),
    getColumnsForElement: (state) =>
      filterColumnsByKey(state, [
        "quantity",
        "clazz",
        "description",
        "quantityType",
        "pricePerQuantity",
        "note",
      ]),
    getColumnsForMetal: (state) =>
      filterColumnsByKey(state, [
        "quantity",
        "clazz",
        "type",
        "quantityType",
        "purity",
        "color",
        "plating",
        "pricePerQuantity",
        "note",
      ]),
    getResourceById: (state) => (id) =>
      state.resources.find((resource) => resource.id === id),
    getResourceDetails: (state) => state.resourceDetails,
  },
};
