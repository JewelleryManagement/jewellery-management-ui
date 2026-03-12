import { defineStore } from "pinia";
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
      localStorage.removeItem("auth");
      localStorage.removeItem("users");
      localStorage.removeItem("resources");
      localStorage.removeItem("products");
      localStorage.removeItem("sales");
      localStorage.removeItem("organizations");
      localStorage.removeItem("allowedValues");
      localStorage.removeItem("systemEvents");
      this.$reset();
    },
  },

  persist: {
    key: "auth",
    storage: localStorage,
  },
});
