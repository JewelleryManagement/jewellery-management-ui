import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import { getCurrentUserPermissions } from "@/services/HttpClientService";

export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    permissionsByOrg: {},
    permissionFormats: {
      ORGANIZATION_READ: { name: "Read Organization", group: "Organization" },
      ORGANIZATION_DELETE: {
        name: "Delete Organization",
        group: "Organization",
      },
      ORGANIZATION_ROLE_UPDATE: {
        name: "Update Role",
        group: "Organization",
      },

      ORGANIZATION_USER_ADD: { name: "Add User", group: "User" },
      ORGANIZATION_USER_DELETE: { name: "Delete User", group: "User" },
      ORGANIZATION_USER_READ: { name: "Read User", group: "User" },
      ORGANIZATION_USER_ROLES_READ: { name: "Read User Roles", group: "User" },

      ORGANIZATION_RESOURCE_ADD: { name: "Add Resource", group: "Resource" },
      ORGANIZATION_RESOURCE_DELETE: {
        name: "Delete Resource",
        group: "Resource",
      },
      ORGANIZATION_RESOURCE_READ: { name: "Read Resource", group: "Resource" },
      ORGANIZATION_RESOURCE_TRANSFER: {
        name: "Transfer Resource",
        group: "Resource",
      },

      ORGANIZATION_PRODUCT_CREATE: { name: "Create Product", group: "Product" },
      ORGANIZATION_PRODUCT_UPDATE: { name: "Update Product", group: "Product" },
      ORGANIZATION_PRODUCT_DELETE: { name: "Delete Product", group: "Product" },
      ORGANIZATION_PRODUCT_TRANSFER: {
        name: "Transfer Product",
        group: "Product",
      },
      ORGANIZATION_PRODUCT_READ: { name: "Read Product", group: "Product" },

      ORGANIZATION_SALE_CREATE: { name: "Create Sale", group: "Sale" },
      ORGANIZATION_SALE_PRODUCT_RETURN: {
        name: "Return Product",
        group: "Sale",
      },
      ORGANIZATION_SALE_READ: { name: "Read Sale", group: "Sale" },
      ORGANIZATION_SALE_RESOURCE_RETURN: {
        name: "Resource Return",
        group: "Sale",
      },
      ORGANIZATION_ROLE_ASSIGN: { name: "Assign Role", group: "Role" },
      ORGANIZATION_ROLE_READ: { name: "Read Role", group: "Role" },
      ORGANIZATION_EVENT_READ: { name: "Read Event", group: "Event" },
    },
  }),
  getters: {
    permissionsForOrg: (state) => {
      return (organizationId) => state.permissionsByOrg[organizationId] ?? [];
    },

    hasPermission: (state) => {
      return (organizationId, permission) =>
        state.permissionsByOrg[organizationId]?.includes(permission) ?? false;
    },

    canReadResource() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_RESOURCE_READ");
    },

    canReadProduct() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_PRODUCT_READ");
    },

    canReadUser() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_USER_READ");
    },

    canReadEvent() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_EVENT_READ");
    },

    canReadRole() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_ROLE_READ");
    },

    canDeleteResource() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_RESOURCE_DELETE");
    },

    canTransferResource() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_RESOURCE_TRANSFER");
    },

    canDisassembleProduct() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_PRODUCT_DELETE");
    },

    canTransferProduct() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_PRODUCT_TRANSFER");
    },

    canAddUser() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_USER_ADD");
    },

    canDeleteUser() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_USER_DELETE");
    },

    canUpdateUser() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_ROLE_UPDATE");
    },

    canAssignRoles() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_ROLE_ASSIGN");
    },

    canReturnResource() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_SALE_RESOURCE_RETURN");
    },

    canReturnProduct() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_SALE_PRODUCT_RETURN");
    },

    canUpdateProduct() {
      return (organizationId) =>
        this.hasPermission(organizationId, "ORGANIZATION_PRODUCT_UPDATE");
    },
  },
  actions: {
    async fetchCurrentUserPermissions(organizationId) {
      const permissions = await getCurrentUserPermissions(organizationId);

      this.permissionsByOrg[organizationId] = permissions;
    },

    async fetchPermissionsForOrganizations(organizationIds) {
      const uniqueOrgIds = [...new Set(organizationIds.filter(Boolean))];

      await Promise.all(
        uniqueOrgIds.map(async (organizationId) => {
          if (this.permissionsByOrg[organizationId]) return;

          try {
            await this.fetchCurrentUserPermissions(organizationId);
          } catch (error) {
            this.permissionsByOrg[organizationId] = [];
          }
        }),
      );
    },
  },
  persist: {
    key: STORAGE_KEYS.PERMISSIONS,
    storage: storageService.getStorage(),
  },
});
