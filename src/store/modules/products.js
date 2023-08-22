import { reactive } from "vue";
import { fetchProducts } from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: reactive({
    products: [],
    tableColumns: [
      { key: "description", title: "Description" },
      { key: "authors", title: "Authors" },
      { key: "inStock", title: "In Stock" },
      { key: "isSold", title: "Sold" },
      { key: "owner", title: "Owner" },
      { key: "picture", title: "Picture" },
      { key: "salePrice", title: "Sale price" },
    ],
  }),
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      const res = await fetchProducts();
      commit("setProducts", res);
    },
  },
  getters: {
    allProducts: (state) => state.products,
    getColumns: (state) => state.tableColumns,
  },
};
