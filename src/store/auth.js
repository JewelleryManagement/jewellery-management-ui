import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import { postUserLogin } from "@/services/HttpClientService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(payload) {
      const userData = await postUserLogin(payload);

      this.user = userData.user;
      this.token = userData.token;

      return userData.user;
    },

    logout() {
      storageService.clearStorage();
      this.$reset();
    },
  },

  persist: {
    key: STORAGE_KEYS.AUTH,
    storage: storageService.getStorage(),
  },
});
