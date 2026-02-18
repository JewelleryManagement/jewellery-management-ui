import {
  getAllEvents,
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
        icon: "mdi-account",
      },
      USER_UPDATE: {
        title: "Update User",
        entity: "User",
        type: "Update",
        icon: "mdi-account",
      },
      USER_DELETE: {
        title: "Delete User",
        entity: "User",
        type: "Delete",
        icon: "mdi-account",
      },
      RESOURCE_CREATE: {
        title: "Create Resource",
        entity: "Resource",
        type: "Create",
        icon: "mdi-diamond-stone",
      },
      RESOURCE_DELETE: {
        title: "Delete Resource",
        entity: "Resource",
        type: "Delete",
        icon: "mdi-diamond-stone",
      },
      RESOURCE_UPDATE: {
        title: "Update Resource",
        entity: "Resource",
        type: "Update",
        icon: "mdi-diamond-stone",
      },
      ORGANIZATION_CREATE: {
        title: "Create Organization",
        entity: "Organization",
        type: "Create",
        icon: "mdi-domain",
      },
      ORGANIZATION_DELETE: {
        title: "Delete Organization",
        entity: "Organization",
        type: "Delete",
        icon: "mdi-domain",
      },
      ORGANIZATION_USER_CREATE: {
        title: "Create User In Organization",
        entity: "UserInOrganization",
        type: "Create",
        icon: "mdi-badge-account",
      },
      ORGANIZATION_USER_DELETE: {
        title: "Delete User In Organization",
        entity: "UserInOrganization",
        type: "Delete",
        icon: "mdi-badge-account",
      },
      ORGANIZATION_USER_UPDATE: {
        title: "Update User In Organization",
        entity: "UserInOrganization",
        type: "Update",
        icon: "mdi-badge-account",
      },
      ORGANIZATION_ADD_RESOURCE_QUANTITY: {
        title: "Add Resource Quantity To Organization",
        entity: "ResourceQuantity",
        type: "Update",
        icon: "mdi-scale-balance",
      },
      ORGANIZATION_REMOVE_RESOURCE_QUANTITY: {
        title: "Remove Resource Quantity From Organization",
        entity: "ResourceQuantity",
        type: "Update",
        icon: "mdi-scale-balance",
      },
      ORGANIZATION_PRODUCT_CREATE: {
        title: "Create Products",
        entity: "Product",
        type: "Create",
        icon: "mdi-package-variant",
      },
      ORGANIZATION_PRODUCT_UPDATE: {
        title: "Update Product",
        entity: "Product",
        type: "Update",
        icon: "mdi-package-variant",
      },
      ORGANIZATION_PRODUCT_DISASSEMBLY: {
        title: "Disassemble Product",
        entity: "Product",
        type: "Delete",
        icon: "mdi-cart-off",
      },
      ORGANIZATION_PRODUCT_TRANSFER: {
        title: "Transfer Product",
        entity: "Product",
        type: "Update",
        icon: "mdi-swap-horizontal",
      },
      ORGANIZATION_RESOURCE_TRANSFER: {
        title: "Transfer Resource",
        entity: "ResourceTransfer",
        type: "Create",
        icon: "mdi-swap-horizontal",
      },
      ORGANIZATION_CREATE_SALE: {
        title: "Create Sale",
        entity: "Sale",
        type: "Create",
        icon: "mdi-cart-outline",
      },
      ORGANIZATION_SALE_RETURN_PRODUCT: {
        title: "Return Product From Sale",
        entity: "ReturnProduct",
        type: "Update",
        icon: "mdi-cart-remove",
      },
      ORGANIZATION_SALE_RETURN_RESOURCE: {
        title: "Return Resource From Sale",
        entity: "ReturnResource",
        type: "Update",
        icon: "mdi-cart-remove",
      },
    },
    eventTableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
    ],

    typeColorMap: {
      Create: "green",
      Update: "purple",
      Delete: "red",
    },
  },

  getters: {
    getEventHeaders: (state) => state.eventHeaders,
    getEventTypes: (state) => state.eventTypes,
    getEventTableButtons: (state) => state.eventTableButtons,
    getTypeColorMap: (state) => state.typeColorMap,
  },

  actions: {
    async getEventsRelatedTo({ commit }, id) {
      return getAllEventsRelatedTo(id);
    },
    async getSystemEvent({ commit }, id) {
      return getSystemEvent(id);
    },
    async getAllEvents({ commit }) {
      return getAllEvents();
    },
  },
};
