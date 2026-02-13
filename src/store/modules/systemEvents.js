import { getAllEventsRelatedTo } from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    eventHeaders: [
      { key: "timestamp", title: "Date" },
      { key: "type", title: "Event Type" },
      { key: "executor", title: "Executor" },
    ],

    eventTypes: {
      USER_CREATE: "Create User",
      USER_UPDATE: "Update User",
      USER_DELETE: "Delete User",
      RESOURCE_CREATE: "Create Resource",
      RESOURCE_DELETE: "Delete Resource",
      RESOURCE_UPDATE: "Update Resource",
      ORGANIZATION_CREATE: "Create Organization",
      ORGANIZATION_DELETE: "Delete Organization",
      ORGANIZATION_USER_CREATE: "Create User In Organization",
      ORGANIZATION_USER_DELETE: "Delete User In Organization",
      ORGANIZATION_USER_UPDATE: "Update User In Organization",
      ORGANIZATION_ADD_RESOURCE_QUANTITY:
        "Add Resource Quantity To Organization",
      ORGANIZATION_REMOVE_RESOURCE_QUANTITY:
        "Remove Resource Quantity From Organization",
      ORGANIZATION_PRODUCT_CREATE: "Create Products",
      ORGANIZATION_PRODUCT_UPDATE: "Update Product",
      ORGANIZATION_PRODUCT_DISASSEMBLY: "Disassemble Product",
      ORGANIZATION_PRODUCT_TRANSFER: "Transfer Product",
      ORGANIZATION_RESOURCE_TRANSFER: "Transfer Resource",
      ORGANIZATION_CREATE_SALE: "Create Sale",
      ORGANIZATION_SALE_RETURN_PRODUCT: "Return Product From Sale",
      ORGANIZATION_SALE_RETURN_RESOURCE: "Return Resource From Sale",
    },
  },

  getters: {
    eventHeaders: (state) => state.eventHeaders,
    eventTypes: (state) => state.eventTypes,
  },

  actions: {
    async getEventsRelatedTo({ commit }, id) {
      return getAllEventsRelatedTo(id);
    },
  },
};
