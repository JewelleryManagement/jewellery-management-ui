import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import {
  fetchResources,
  postResources,
  removeResource,
  fetchAvailabilityResourceById,
  updateResource,
  getResourceById,
} from "@/services/HttpClientService";
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

const RESOURCE_COLUMN_KEYS = {
  Pearl: [
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
  ],
  Diamond: [
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
  ],
  DiamondMelee: [
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
  ],
  ColoredStone: [
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
  ],
  ColoredStoneMelee: [
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
  ],
  SemiPreciousStone: [
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
  ],
  Element: ["description", "pricePerQuantity", "note", "totalPrice", "sku"],
  Metal: [
    "type",
    "color",
    "purity",
    "pricePerQuantity",
    "note",
    "totalPrice",
    "sku",
  ],
};

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

export const useResourcesStore = defineStore("resources", {
  state: () => ({
    resources: [],
    resourceDetails: {},
    currentAvailability: {},
    selectedResource: {},
    resourcesQueries: {},
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
    tableColumnClazz: { key: "clazz", title: "Clazz" },
    tableColumnQuantityType: { key: "quantityType", title: "Quantity Type" },
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableColumnActions: { key: "actions", title: "", slot: "actions" },
    tableColumnOwner: { key: "owner", title: "Owner" },
    tableColumnDealPrice: { key: "dealPrice", title: "Deal Price" },
    tableColumnNewOwner: { key: "newOwner", title: "New Owner" },
    tableColumnPreviousOwner: { key: "previousOwner", title: "Previous Owner" },
    tableColumnAddQuantity: {
      key: "addQuantity",
      title: "",
      slot: "addQuantity",
    },
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
  getters: {
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
    getResourceQuery:
      (state) =>
      ({ clazz, type, quantityType }) =>
        state.resourcesQueries[clazz]?.[type] ??
        state.resourcesQueries[clazz]?.[quantityType] ??
        state.resourcesQueries[clazz] ??
        null,
    getTitle: (state) => (key) => state.titles[key]?.title ?? null,
    resourceFilterButtons: (state) =>
      Object.fromEntries(
        Object.entries(state.resourcesQueries).map(([clazz, entries]) => [
          clazz,
          Object.keys(entries),
        ]),
      ),
    getParamsFieldName: (state) => (clazz) =>
      state.allowedValueParams?.[clazz]?.fieldName ?? null,
    getTableColumnOrganizationQuantity: (state) => [
      state.tableColumnOwner,
      state.tableColumnDealPrice,
    ],
    getTableColumnsOrganizationTransfer: (state) => [
      state.tableColumnNewOwner,
      state.tableColumnPreviousOwner,
      state.tableColumnDealPrice,
    ],
    getColumnsByResource: (state) => (resource, additional) => {
      const keys = RESOURCE_COLUMN_KEYS[resource];
      if (!keys) return [];
      return filterColumnsByKey(state, additional, keys);
    },
    getTableColumnsWithQuantity: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
  },
  actions: {
    async fetchResources() {
      const res = await fetchResources();
      const formattedResponse = Object.values(res).map((item) => ({
        ...item.resource,
        quantity: item.quantity,
      }));
      this.resources = formattedResponse;
    },
    async fetchResourceById(resourceId) {
      const data = await getResourceById(resourceId);
      this.selectedResource = data;
      return data;
    },
    async createResource(formData) {
      const res = await postResources(formData);
      this.resources.push(res);
      return res;
    },
    async removeResource(id) {
      await removeResource(id);
      this.resources = this.resources.filter((resource) => resource.id !== id);
    },
    setResourceDetails(data) {
      this.resourceDetails = structuredClone(data);
    },
    async fetchAvailabilityResourceById(resourceId) {
      const data = await fetchAvailabilityResourceById(resourceId);
      this.currentAvailability = data;
      return data;
    },
    setResourceDetailsField({ key, value }) {
      this.resourceDetails[key] = value;
    },
    async updateResource({ id, ...resourceWithoutId }) {
      const updatedResource = await updateResource(id, resourceWithoutId);

      const index = this.resources.findIndex(
        (resource) => resource.id === updatedResource.id,
      );

      if (index !== -1) {
        this.resources[index] = updatedResource;
      }
    },
    async buildResourcesQueries() {
      const allowedValueParams = this.allowedValueParams;

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

      this.resourcesQueries = queriesByResourceClass;
    },
    clearResources() {
      this.resources = [];
    },
  },
  persist: {
    key: STORAGE_KEYS.RESOURCES,
    storage: storageService.getStorage(),
  },
});
