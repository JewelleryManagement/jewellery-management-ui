import { reactive } from "vue";
import {
  fetchProducts,
  postProduct,
  fetchProductsByOwner,
} from "@/services/HttpClientService.js";

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
      { key: "picture", title: "Picture" },
      { key: "salePrice", title: "Sale price" },
      { key: "partOfProduct", title: "Part of product" },
    ],

    tableColumnAdd: { key: "add", title: "", slot: "add" },
    tableColumnOwner: {
      key: "owner",
      title: "Owner",
      slot: "owner",
    },
    tableColumnResourcesContent: {
      key: "resourceContent",
      title: "Resources Content",
      slot: "resourceContent",
    },
    tableColumnProductsContent: {
      key: "productsContent",
      title: "Products Content",
      slot: "productsContent",
    },
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
      await postProduct(product);
    },
    async getProductsByOwner({ commit }, ownerId) {
      const res = await fetchProductsByOwner(ownerId);
      commit("setProducts", res);
    },
  },
  getters: {
    allProducts: (state) => {
      return state.products.map(formatAuthors);
    },
    getColumns: (state) => [
      ...state.tableColumns,
      state.tableColumnResourcesContent,
      state.tableColumnProductsContent,
      state.tableColumnOwner,
    ],
    getColumnsWithAdd: (state) => [state.tableColumnAdd, ...state.tableColumns],
    getColumnsWithRCandPC: (state) => [
      ...state.tableColumns,
      state.tableColumnResourcesContent,
      state.tableColumnProductsContent,
    ],
  },
};

function formatAuthors(product) {
  return {
    ...product,
    authors: product.authors.map((author) => author.name).join(", "),
  };
}
