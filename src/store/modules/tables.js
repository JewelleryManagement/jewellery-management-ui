import { fetchResources } from "@/services/HttpClientService.js";


export default {
  namespaced: true,
  state() {
    return {};
  },
  actions: {
    async fetchResources() {
        const res = await fetchResources()
    }
  },
  mutations: {},
  getters: {},
};
