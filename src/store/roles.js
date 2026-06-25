import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import {
  getPermissionsByRoleType,
  postCreateRole,
  getRolesByType,
  getRole,
  getUserOrganizationRoles,
  getUserSystemRoles,
  removeRole,
} from "@/services/HttpClientService";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    selectedRole: {},
    columns: [
      { key: "name", title: "Name" },
      { key: "roleType", title: "Role Type" },
      { key: "permissions", title: "Permissions" },
    ],
    tableColumnActions: { key: "actions", title: "", slot: "actions" },
  }),
  getters: {
    getTableColumnsWithActions: (state) => [
      ...state.columns,
      state.tableColumnActions,
    ],
  },
  actions: {
    async createRole(data) {
      await postCreateRole(data);
    },

    async fetchRole(id) {
      const data = await getRole(id);
      this.selectedRole = data;
      return data;
    },

    async fetchAllPermissionsByRoleType(type) {
      return await getPermissionsByRoleType(type);
    },

    async fetchAllRolesByType(type) {
      return await getRolesByType(type);
    },

    async fetchUserOrganizationRoles(userId) {
      return getUserOrganizationRoles(userId);
    },

    async fetchUserSystemRoles(userId) {
      return getUserSystemRoles(userId);
    },

    async deleteRoleById(roleId) {
      await removeRole(roleId);
    },
  },
  persist: {
    key: STORAGE_KEYS.ROLES,
    storage: storageService.getStorage(),
  },
});
