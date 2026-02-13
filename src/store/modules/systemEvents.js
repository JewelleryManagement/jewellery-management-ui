import {
  getAllEventsRelatedTo,
  getSystemEvent,
} from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    eventHeaders: [
      { key: "timestamp", title: "Date" },
      { key: "type", title: "Event Type" },
      { key: "executor", title: "Executor" },
    ],

    eventTypes: {
      USER_CREATE: {
        title: "Create User",
        entity: "User",
        type: "Create",
      },
      USER_UPDATE: {
        title: "Update User",
        entity: "User",
        type: "Update",
      },
      USER_DELETE: {
        title: "Delete User",
        entity: "User",
        type: "Delete",
      },
      RESOURCE_CREATE: {
        title: "Create Resource",
        entity: "Resource",
        type: "Create",
      },
      RESOURCE_DELETE: {
        title: "Delete Resource",
        entity: "Resource",
        type: "Delete",
      },
      RESOURCE_UPDATE: {
        title: "Update Resource",
        entity: "Resource",
        type: "Update",
      },
      ORGANIZATION_CREATE: {
        title: "Create Organization",
        entity: "Organization",
        type: "Create",
      },
      ORGANIZATION_DELETE: {
        title: "Delete Organization",
        entity: "Organization",
        type: "Delete",
      },
      ORGANIZATION_USER_CREATE: {
        title: "Create User In Organization",
        entity: "UserInOrganization",
        type: "Create",
      },
      ORGANIZATION_USER_DELETE: {
        title: "Delete User In Organization",
        entity: "UserInOrganization",
        type: "Delete",
      },
      ORGANIZATION_USER_UPDATE: {
        title: "Update User In Organization",
        entity: "UserInOrganization",
        type: "Update",
      },
      ORGANIZATION_ADD_RESOURCE_QUANTITY: {
        title: "Add Resource Quantity To Organization",
        entity: "ResourceQuantity",
        type: "Update",
      },
      ORGANIZATION_REMOVE_RESOURCE_QUANTITY: {
        title: "Remove Resource Quantity From Organization",
        entity: "ResourceQuantity",
        type: "Update",
      },
      ORGANIZATION_PRODUCT_CREATE: {
        title: "Create Products",
        entity: "Product",
        type: "Create",
      },
      ORGANIZATION_PRODUCT_UPDATE: {
        title: "Update Product",
        entity: "Product",
        type: "Update",
      },
      ORGANIZATION_PRODUCT_DISASSEMBLY: {
        title: "Disassemble Product",
        entity: "Product",
        type: "Delete",
      },
      ORGANIZATION_PRODUCT_TRANSFER: {
        title: "Transfer Product",
        entity: "Product",
        type: "Update",
      },
      ORGANIZATION_RESOURCE_TRANSFER: {
        title: "Transfer Resource",
        entity: "ResourceTransfer",
        type: "Create",
      },
      ORGANIZATION_CREATE_SALE: {
        title: "Create Sale",
        entity: "Sale",
        type: "Create",
      },
      ORGANIZATION_SALE_RETURN_PRODUCT: {
        title: "Return Product From Sale",
        entity: "ReturnProduct",
        type: "Update",
      },
      ORGANIZATION_SALE_RETURN_RESOURCE: {
        title: "Return Resource From Sale",
        entity: "ReturnResource",
        type: "Update",
      },
    },
    eventTableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
    ],
  },

  getters: {
    getEventHeaders: (state) => state.eventHeaders,
    getEventTypes: (state) => state.eventTypes,
    getEventTableButtons: (state) => state.eventTableButtons,
  },

  actions: {
    async getEventsRelatedTo({ commit }, id) {
      return getAllEventsRelatedTo(id);
    },
    async getSystemEvent({ commit }, id) {
      return getSystemEvent(id);
    },
  },
};
