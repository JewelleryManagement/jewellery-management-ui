import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import {
  fetchUsers,
  getUser,
  fetchPurchasedResourcePerUser,
  getUserInOrganization,
  postUser,
  updateUser,
  fetchUsersByOrganization,
  getAllUsersByOrganizationWithRoles,
} from "@/services/HttpClientService";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    selectedUser: {},
    purchasedResources: [],
    baseColumns: [
      { key: "id", title: "Id", align: "d-none" },
      { key: "firstName", title: "First Name" },
      { key: "lastName", title: "Last Name" },
      { key: "email", title: "Email" },
    ],
    additionalColumns: [
      { key: "address", title: "Address" },
      { key: "phone", title: "Phone" },
      { key: "phone2", title: "Phone2" },
      { key: "birthDate", title: "Birth Date" },
      { key: "note", title: "Note" },
      { key: "role", title: "Role" },
    ],
    tableColumnRoles: {
      key: "roles",
      title: "Roles",
      slot: "roles",
    },
    tableActions: { key: "actions", title: "", slot: "actions" },
    tableColumnOrganizationPermissions: {
      key: "organizationPermissions",
      title: "Permissions",
      slot: "organizationPermissions",
    },
    tableColumnOrganization: {
      key: "organization",
      title: "Organization",
      slot: "organization",
    },
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
      {
        label: "Organization Roles",
        icon: "mdi-shield-account",
      },
      {
        label: "System Roles",
        icon: "mdi-shield-account",
      },
    ],
  }),
  getters: {
    getPurchasedResources: (state) =>
      state.purchasedResources?.map((resource) => ({
        quantity: resource.resourceAndQuantity.quantity,
        ...resource.resourceAndQuantity.resource,
      })) ?? [],
    getOrganizationColumns: (state) => [
      ...state.baseColumns,
      state.tableColumnRoles,
      state.tableActions,
    ],
    getTableColumnsWithActions: (state) => [
      ...state.baseColumns,
      ...state.additionalColumns,
      state.tableActions,
    ],
    getAllInformationColumns: (state) => [
      ...state.baseColumns,
      ...state.additionalColumns,
    ],
    getBaseColumnsWithPermmisions: (state) => [
      ...state.baseColumns,
      state.tableColumnOrganizationPermissions,
      state.tableColumnOrganization,
    ],
  },
  actions: {
    async fetchUsers() {
      const users = await fetchUsers();
      this.users = users;
    },
    async fetchUser(id) {
      const user = await getUser(id);
      this.selectedUser = user;
    },
    async fetchPurchasedResourcesPerUser(userId) {
      const resources = await fetchPurchasedResourcePerUser(userId);
      this.purchasedResources = resources;
    },
    async fetchUserInOrganization({ organizationId, userId }) {
      return await getUserInOrganization(organizationId, userId);
    },
    async createUser(userData) {
      return await postUser(userData);
    },
    async updateUser({ userId, data }) {
      return await updateUser(userId, data);
    },
    async fetchUsersByOrganization(organizationId) {
      return await fetchUsersByOrganization(organizationId);
    },
    async fetchUsersByOrganizationWithRoles(organizationId) {
      return await getAllUsersByOrganizationWithRoles(organizationId);
    },
    clearUsers() {
      this.users = [];
    },
  },
  persist: {
    key: STORAGE_KEYS.USERS,
    storage: storageService.getStorage(),
  },
});
