import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import {
  getAllPermissions,
  postCreateRole,
  getRolesByType,
  getRole,
} from "@/services/HttpClientService";

export const useRolesStore = defineStore("roles", {
  state: () => ({
    selectedRole: {},
    columns: [
      { key: "name", title: "Name" },
      { key: "roleType", title: "Role Type" },
      { key: "permissions", title: "Permissions" },
    ],
  }),
  getters: {},
  actions: {
    async createRole(data) {
      await postCreateRole(data);
    },

    async fetchRole(id) {
      const data = await getRole(id);
      this.selectedRole = data;
      return data;
    },

    async fetchAllPermissions() {
      return await getAllPermissions();
    },

    async fetchAllRolesByType(type) {
      return await getRolesByType(type);
    },
  },
  persist: {
    key: STORAGE_KEYS.ROLES,
    storage: storageService.getStorage(),
  },
});
