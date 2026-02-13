import { reactive } from "vue";
import {
  fetchResources,
  postResources,
  removeResource,
  updateResource,
  fetchAvailabilityResourceById,
} from "@/services/HttpClientService.js";
import AllowedValuesService from "@/services/AllowedValuesService";
import {
  PEARL_CLAZZ,
  DIAMOND_CLAZZ,
  DIAMON_MELEE_CLAZZ,
  COLORED_STONE_CLAZZ,
  COLORED_STONE_MELEE_CLAZZ,
  SEMI_PRECIOUS_STONE_CLAZZ,
  METAL_CLAZZ,
  ELEMENT_CLAZZ,
} from "@/utils/clazzConstants";

const filterColumnsByKey = (state, additional, keys) => {
  const additionalColumnsLeft = [state.tableColumnQuantity];

  const additionalColumnsRight = [state.tableColumnActions];

  const filteredColumns = keys
    .map((key) => state.tableColumns.find((col) => col.key === key))
    .filter(Boolean);

  const additionalColumns = additional
    ? [state.tableColumnClazz, state.tableColumnQuantityType]
    : [];

  const result = [
    ...additionalColumnsLeft,
    ...additionalColumns,
    ...filteredColumns,
    ...additionalColumnsRight,
  ];

  return result;
};

const setSingleQuery = (queries, resourceClazz) => {
  queries[resourceClazz] = { clazz: resourceClazz };
};

const addValueQueries = (queries, resourceClazz, allowedValues) => {
  queries[resourceClazz] ??= {};
  for (const { fieldName, value } of allowedValues) {
    queries[resourceClazz][value] = {
      clazz: resourceClazz,
      [fieldName]: value,
    };
  }
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
      { key: "clarity", title: "Clarity" },
      { key: "polish", title: "Polish" },
      { key: "symmetry", title: "Symmetry" },
      { key: "fluorescence", title: "Fluorescence" },
      { key: "certificate", title: "Certificate" },
      { key: "treatment", title: "Treatment" },
      { key: "totalPrice", title: "Total Price" },
    ],
    allowedValueParams: {
      Pearl: { resourceClazz: PEARL_CLAZZ, fieldName: "quantityType" },
      Diamond: { resourceClazz: DIAMOND_CLAZZ, fieldName: "type" },
      DiamondMelee: { resourceClazz: DIAMON_MELEE_CLAZZ, fieldName: "type" },
      ColoredStone: {
        resourceClazz: COLORED_STONE_CLAZZ,
        fieldName: "quantityType",
      },
      ColoredStoneMelee: {
        resourceClazz: COLORED_STONE_MELEE_CLAZZ,
        fieldName: "quantityType",
      },
      SemiPreciousStone: {
        resourceClazz: SEMI_PRECIOUS_STONE_CLAZZ,
        fieldName: "quantityType",
      },
      Metal: { resourceClazz: METAL_CLAZZ, fieldName: "type" },
      Element: { resourceClazz: ELEMENT_CLAZZ, fieldName: "quantityType" },
    },

    resourcesQueries: {},

    titles: {
      Pearl: {
        title: "Pearl",
      },
      Diamond: {
        title: "Diamond",
      },
      DiamondMelee: {
        title: "Diamond Melee",
      },
      ColoredStone: {
        title: "Colored Stone",
      },
      ColoredStoneMelee: {
        title: "Colored Stone Melee",
      },
      SemiPreciousStone: {
        title: "Semi Precious Stone",
      },
      Metal: {
        title: "Metal",
      },
      Element: { title: "Element" },
    },
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableColumnActions: { key: "actions", title: "", slot: "actions" },
    tableColumnAddQuantity: {
      key: "addQuantity",
      title: "",
      slot: "addQuantity",
    },
    tableColumnClazz: { key: "clazz", title: "Clazz" },
    tableColumnQuantityType: { key: "quantityType", title: "Quantity Type" },
    tableButtons: [
      { label: "Sales", icon: "mdi-cart-outline" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Organizations",
        icon: "mdi-diamond-stone",
      },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
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
        (resource) => resource.id !== id,
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
        (resource) => resource.id === updatedResource.id,
      );
      if (index !== -1) state.resources[index] = updatedResource;
    },
    setResourcesQueries(state, payload) {
      state.resourcesQueries = payload;
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
      return res;
    },
    async removeResource({ commit }, id) {
      await removeResource(id);
      commit("removeResource", id);
    },
    setResourceDetails({ commit }, data) {
      commit("setResourceDetails", structuredClone(data));
    },
    setResourceDetailsField({ commit }, { key, value }) {
      commit("setResourceDetailsField", { key, value });
    },
    setResourceForm({ commit }, data) {
      commit("setResourcForm", data);
    },
    async updateResource({ commit }, { id, ...resourceWithoutId }) {
      const updatedResource = await updateResource(id, resourceWithoutId);
      commit("updateResource", updatedResource);
    },
    async fetchAvailabilityResourceById({ commit }, resourceId) {
      return await fetchAvailabilityResourceById(resourceId);
    },
    async buildResourcesQueries({ state, commit }) {
      const allowedValueParams = state.allowedValueParams;

      const responses = await Promise.all(
        Object.values(allowedValueParams).map((param) =>
          AllowedValuesService.get(param),
        ),
      );

      const allowedValuesLists = responses.map((response) => response.data);

      const queriesByResourceClass = {};

      for (const allowedValues of allowedValuesLists) {
        const resourceClazz = allowedValues[0].resourceClazz;

        if (allowedValues.length === 1) {
          setSingleQuery(queriesByResourceClass, resourceClazz);
        } else {
          addValueQueries(queriesByResourceClass, resourceClazz, allowedValues);
        }
      }

      commit("setResourcesQueries", queriesByResourceClass);
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
      state.tableColumnActions,
    ],
    getAvailabilityUpdateColumns: (state) => [
      state.tableColumnActions,
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
    getColumnsForPearl: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "quality",
        "shape",
        "shapeSpecification",
        "color",
        "colorHue",
        "size",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForDiamond: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "shape",
        "size",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "polish",
        "symmetry",
        "fluorescence",
        "pricePerQuantity",
        "certificate",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForDiamondMelee: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "shape",
        "size",
        "carat",
        "color",
        "clarity",
        "cut",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForColoredStone: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "shape",
        "size",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "treatment",
        "pricePerQuantity",
        "certificate",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForColoredStoneMelee: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "shape",
        "size",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "treatment",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForSemiPreciousStone: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "quality",
        "shape",
        "shapeSpecification",
        "color",
        "colorHue",
        "size",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForElement: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "description",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getColumnsForMetal: (state) => (additional) =>
      filterColumnsByKey(state, additional, [
        "type",
        "color",
        "purity",
        "pricePerQuantity",
        "note",
        "totalPrice",
        "sku",
      ]),
    getResourceById: (state) => (id) =>
      state.resources.find((resource) => resource.id === id),
    getResourceDetails: (state) => state.resourceDetails,
    getResourceQuery:
      (state) =>
      ({ clazz, type, quantityType }) =>
        state.resourcesQueries[clazz]?.[type] ??
        state.resourcesQueries[clazz]?.[quantityType] ??
        state.resourcesQueries[clazz] ??
        null,

    getAllResourceQueries: (state) => state.resourcesQueries,
    getTitle: (state) => (key) => {
      return state.titles[key]?.title || null;
    },
    resourceFilterButtons: (state) =>
      Object.fromEntries(
        Object.entries(state.resourcesQueries).map(([clazz, entries]) => [
          clazz,
          Object.keys(entries),
        ]),
      ),
    getParamsFieldName: (state) => (clazz) => {
      return state.allowedValueParams[clazz].fieldName;
    },
    getAdditionalResourceColumns: (state) => [
      state.tableColumnClazz,
      state.tableColumnQuantityType,
    ],
    getTableButtons: (state) => state.tableButtons,
  },
};
