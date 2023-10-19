import { reactive } from "vue";
import { fetchProducts, postProduct } from "@/services/HttpClientService.js";

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
      { key: "ownerId", title: "Owner" },
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
    async createProduct({ commit }, product) {
      await postProduct(product)
    },
  },
  getters: {
    allProducts: (state) => {
      return state.products.map(product => ({
        ...product,
        authors: product.authors.map(author => author.name).join(', ')
      }))
    },
    getColumns: (state) => state.tableColumns,
  },
};
