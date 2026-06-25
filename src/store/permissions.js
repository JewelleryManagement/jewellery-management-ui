import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import {
  getCurrentUserPermissions,
  getCurrentUserSystemPermissions,
} from "@/services/HttpClientService";
import {
  ORGANIZATION_EVENT_READ,
  ORGANIZATION_PRODUCT_DELETE,
  ORGANIZATION_PRODUCT_READ,
  ORGANIZATION_PRODUCT_TRANSFER,
  ORGANIZATION_PRODUCT_UPDATE,
  ORGANIZATION_RESOURCE_DELETE,
  ORGANIZATION_RESOURCE_READ,
  ORGANIZATION_RESOURCE_TRANSFER,
  ORGANIZATION_ROLE_ASSIGN,
  ORGANIZATION_ROLE_READ,
  ORGANIZATION_ROLE_UPDATE,
  ORGANIZATION_SALE_PRODUCT_RETURN,
  ORGANIZATION_SALE_RESOURCE_RETURN,
  ORGANIZATION_USER_ADD,
  ORGANIZATION_USER_DELETE,
  ORGANIZATION_USER_READ,
  SYSTEM_EVENT_READ,
  SYSTEM_RESOURCE_CREATE,
  SYSTEM_RESOURCE_DELETE,
  SYSTEM_RESOURCE_UPDATE,
  SYSTEM_USER_CREATE,
  SYSTEM_USER_DELETE,
  SYSTEM_USER_READ,
  SYSTEM_USER_UPDATE,
  SYSTEM_ROLE_READ,
  SYSTEM_RESOURCE_READ,
  SYSTEM_ROLE_CREATE,
  SYSTEM_ROLE_DELETE,
  SYSTEM_ORGANIZATION_CREATE,
} from "@/utils/permissionConstants";

export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    permissionsByOrg: {},
    systemPermissions: [],
    permissionFormats: {
      SYSTEM_USER_READ: { name: "Read User", group: "User" },
      SYSTEM_USER_CREATE: { name: "Create User", group: "User" },
      SYSTEM_USER_UPDATE: { name: "Update User", group: "User" },
      SYSTEM_USER_DELETE: { name: "Delete User", group: "User" },
      SYSTEM_RESOURCE_READ: { name: "Read Resource", group: "Resource" },
      SYSTEM_RESOURCE_CREATE: { name: "Create Resource", group: "Resource" },
      SYSTEM_RESOURCE_UPDATE: { name: "Update Resource", group: "Resource" },
      SYSTEM_RESOURCE_DELETE: { name: "Delete Resource", group: "Resource" },
      SYSTEM_RESOURCE_IMPORT: { name: "Import Resource", group: "Resource" },
      SYSTEM_ROLE_CREATE: { name: "Create Role", group: "Role" },
      SYSTEM_ROLE_DELETE: { name: "Delete Role", group: "Role" },
      SYSTEM_ROLE_ASSIGN: { name: "Assign System Role", group: "Role" },
      SYSTEM_ROLE_READ: { name: "Read Role", group: "Role" },
      SYSTEM_EVENT_READ: { name: "Read Event", group: "Event" },
      SYSTEM_ORGANIZATION_CREATE: {
        name: "Create Organization",
        group: "Organization",
      },

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

    hasOrganizationPermission: (state) => {
      return (organizationId, permission) =>
        state.permissionsByOrg[organizationId]?.includes(permission) ?? false;
    },

    hasSystemPermission: (state) => {
      return (permission) =>
        state.systemPermissions.some(
          (systemPermission) => systemPermission.permission === permission,
        );
    },

    canReadSystemUsers() {
      return this.hasSystemPermission(SYSTEM_USER_READ);
    },

    canCreateSystemUsers() {
      return this.hasSystemPermission(SYSTEM_USER_CREATE);
    },

    canUpdateSystemUsers() {
      return this.hasSystemPermission(SYSTEM_USER_UPDATE);
    },

    canDeleteSystemUsers() {
      return this.hasSystemPermission(SYSTEM_USER_DELETE);
    },

    canReadSystemResource() {
      return this.hasSystemPermission(SYSTEM_RESOURCE_READ);
    },

    canCreateSystemResource() {
      return this.hasSystemPermission(SYSTEM_RESOURCE_CREATE);
    },

    canUpdateSystemResource() {
      return this.hasSystemPermission(SYSTEM_RESOURCE_UPDATE);
    },

    canDeleteSystemResource() {
      return this.hasSystemPermission(SYSTEM_RESOURCE_DELETE);
    },

    canReadSystemEvents() {
      return this.hasSystemPermission(SYSTEM_EVENT_READ);
    },

    canReadSystemRoles() {
      return this.hasSystemPermission(SYSTEM_ROLE_READ);
    },

    canCreateSystemRoles() {
      return this.hasSystemPermission(SYSTEM_ROLE_CREATE);
    },

    canDeleteSystemRoles() {
      return this.hasSystemPermission(SYSTEM_ROLE_DELETE);
    },

    canCreateSystemOrganization() {
      return this.hasSystemPermission(SYSTEM_ORGANIZATION_CREATE);
    },

    canReadResource() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_RESOURCE_READ,
        );
    },

    canReadProduct() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_PRODUCT_READ,
        );
    },

    canReadUser() {
      return (organizationId) =>
        this.hasOrganizationPermission(organizationId, ORGANIZATION_USER_READ);
    },

    canReadEvent() {
      return (organizationId) =>
        this.hasOrganizationPermission(organizationId, ORGANIZATION_EVENT_READ);
    },

    canReadRole() {
      return (organizationId) =>
        this.hasOrganizationPermission(organizationId, ORGANIZATION_ROLE_READ);
    },

    canDeleteResource() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_RESOURCE_DELETE,
        );
    },

    canTransferResource() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_RESOURCE_TRANSFER,
        );
    },

    canDisassembleProduct() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_PRODUCT_DELETE,
        );
    },

    canTransferProduct() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_PRODUCT_TRANSFER,
        );
    },

    canAddUser() {
      return (organizationId) =>
        this.hasOrganizationPermission(organizationId, ORGANIZATION_USER_ADD);
    },

    canDeleteUser() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_USER_DELETE,
        );
    },

    canUpdateUser() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_ROLE_UPDATE,
        );
    },

    canAssignRoles() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_ROLE_ASSIGN,
        );
    },

    canReturnResource() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_SALE_RESOURCE_RETURN,
        );
    },

    canReturnProduct() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_SALE_PRODUCT_RETURN,
        );
    },

    canUpdateProduct() {
      return (organizationId) =>
        this.hasOrganizationPermission(
          organizationId,
          ORGANIZATION_PRODUCT_UPDATE,
        );
    },
  },
  actions: {
    async fetchCurrentUserOrgnizationPermissions(organizationId) {
      const permissions = await getCurrentUserPermissions(organizationId);

      this.permissionsByOrg[organizationId] = permissions;
    },

    async fetchCurrentUserSystemPermissions() {
      const permissions = await getCurrentUserSystemPermissions();

      this.systemPermissions = permissions;
    },

    async fetchPermissionsForOrganizations(organizationIds) {
      const uniqueOrgIds = [...new Set(organizationIds.filter(Boolean))];

      await Promise.all(
        uniqueOrgIds.map(async (organizationId) => {
          if (this.permissionsByOrg[organizationId]) return;

          try {
            await this.fetchCurrentUserOrgnizationPermissions(organizationId);
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
