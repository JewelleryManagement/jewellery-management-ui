import { defineStore } from "pinia";
import {
  fetchOrgs,
  getResourceAvailabilityByOrganization,
  postOrg,
  getUserOrganizationsByPermission,
  postResourceToOrg,
  removeResourceFromOrg,
  postResourceTranferToOrg,
  postUserToOrg,
  putUserToOrg,
  removeUserFromOrg,
  getOrganization,
} from "@/services/HttpClientService";

export const useOrganizationsStore = defineStore("organizations", {
  state: () => ({
    selectedOrganization: {},
    organizations: [],
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "name", title: "Name" },
      { key: "address", title: "Address" },
      { key: "note", title: "Note" },
    ],
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    userPermissions: [
      "DESTROY_ORGANIZATION",
      "MANAGE_USERS",
      "ADD_RESOURCE_QUANTITY",
      "REMOVE_RESOURCE_QUANTITY",
      "CREATE_PRODUCT",
      "EDIT_PRODUCT",
      "DISASSEMBLE_PRODUCT",
      "TRANSFER_PRODUCT",
      "CREATE_SALE",
      "RETURN_RESOURCE",
      "RETURN_PRODUCT",
      "TRANSFER_RESOURCE",
    ],
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Members",
        icon: "mdi-account-multiple",
      },

      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
  }),
  getters: {
    getAllColumnsWithQuantityColumn: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
  },
  actions: {
    async fetchOrganizations() {
      const orgs = await fetchOrgs();
      this.organizations = orgs;
    },
    async fetchOrganizationResources(orgId) {
      return await getResourceAvailabilityByOrganization(orgId);
    },
    async postOrg(data) {
      await postOrg(data);
    },
    async fetchUserOrgsByPermission(permission) {
      return await getUserOrganizationsByPermission(permission);
    },
    async postResourceToOrg(data) {
      await postResourceToOrg(data);
    },
    async removeResourceFromOrg(data) {
      const { organizationId, resourceId, quantity } = data;
      await removeResourceFromOrg(organizationId, resourceId, quantity);
    },
    async transferResourceFromOrg(data) {
      await postResourceTranferToOrg(data);
    },
    async addUserToOrg(data) {
      const { requestBody, orgId } = data;
      return await postUserToOrg(orgId, requestBody);
    },
    async editUserInOrg(data) {
      const { userId, orgId, requestBody } = data;
      return await putUserToOrg(orgId, userId, requestBody);
    },
    async removeUser(data) {
      const { userId, orgId } = data;
      return await removeUserFromOrg(orgId, userId);
    },
    async fetchOrganization(id) {
      const data = await getOrganization(id);
      this.selectedOrganization = data;
      return data;
    },
  },
  persist: {
    key: "organizations",
    storage: localStorage,
  },
});
