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
  const additionalColumnsLeft = [state.tableColumnQuantity];

  const additionalColumnsRight = [
    state.tableColumnDelete,
    state.tableColumnEdit,
    state.tableColumnDuplicate,
    state.tableColumnAdd,
  ];

  const filteredColumns = keys
    .map((key) => state.tableColumns.find((col) => col.key === key))
    .filter(Boolean);

  const result = [
    ...additionalColumnsLeft,
    ...filteredColumns,
    ...additionalColumnsRight,
  ];

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
      { key: "shapeSpecification", title: "Shape Specifications" },
      { key: "colorHue", title: "Color Hue" },
      { key: "sku", title: "Sku" },
      { key: "polish", title: "Polish" },
      { key: "symmetry", title: "Symmetry" },
      { key: "fluorescence", title: "Fluorescence" },
      { key: "certificate", title: "Certificate" },
    ],
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableColumnDelete: { key: "delete", title: "", slot: "delete" },
    tableColumnEdit: { key: "edit", title: "", slot: "edit" },
    tableColumnDuplicate: { key: "duplicate", title: "", slot: "duplicate" },
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
    setResourceDetailsField(state, { key, value }) {
      state.resourceDetails[key] = value;
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
    setResourceDetailsField({ commit }, { key, value }) {
      commit("setResourceDetailsField", { key, value });
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
      state.tableColumnDuplicate,
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
        "clazz",
        "quantityType",
        "type",
        "quality",
        "shape",
        "shapeSpecification",
        "color",
        "colorHue",
        "size",
        "pricePerQuantity",
        "note",
        "sku",
      ]),
    getColumnsForDiamond: (state) =>
      filterColumnsByKey(state, [
        "clazz",
        "quantityType",
        "type",
        "shape",
        "size",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "polish",
        "symmety",
        "fluorescence",
        "pricePerQuantity",
        "certificate",
        "note",
        "sku",
      ]),
    getColumnsForSemiDiamond: (state) =>
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
