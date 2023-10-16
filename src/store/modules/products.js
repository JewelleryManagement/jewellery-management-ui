import { reactive } from "vue";
import { fetchProducts } from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: reactive({
    products: [],
    tableColumns: [
      { key: "catalogNumber", title: "Catalog Number" },
      { key: "productionNumber", title: "Production Number" },
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
    addProduct(state, product) {
      state.products.push(product);
    }
  },
  actions: {
    async fetchProducts({ commit }) {
      const res = await fetchProducts();
      commit("setProducts", res);
    },
    createProduct({ commit }, product) {
      commit("addProduct", product);
    },
  },
  getters: {
    allProducts: (state) => {
      return state.products.map(product => ({
        ...product,
        authors: Array.isArray(product.authors) ? product.authors.join(', ') : product.authors
      }))
    },
    getColumns: (state) => state.tableColumns,
  },
};
