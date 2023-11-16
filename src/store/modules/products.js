import { reactive } from "vue";
import {
  fetchProducts,
  postProduct,
  fetchProductsByOwner,
  disassmebleProduct,
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: reactive({
    products: [],
    currentUserProducts: [],
    tableColumns: [
      { key: "catalogNumber", title: "Catalog Number" },
      { key: "productionNumber", title: "Production Number" },
      { key: "description", title: "Description" },
      { key: "authors", title: "Authors" },
      { key: "sold", title: "Sold" },
      { key: "salePrice", title: "Sale price" },
      { key: "contentOf", title: "Part of product" },
    ],

    tableColumnAdd: { key: "add", title: "", slot: "add" },
    tableColumnOwner: {
      key: "owner",
      title: "Owner",
      slot: "owner",
      align: "center",
    },
    tableColumnResourcesContent: {
      key: "resourceContent",
      title: "Resources Content",
      slot: "resourceContent",
      align: "center",
    },
    tableColumnProductsContent: {
      key: "productsContent",
      title: "Products Content",
      slot: "productsContent",
      align: "center",
    },
    tableColumnDisassembly: {
      key: "disassembly",
      title: "Disassembly",
      align: "center",
    },
  }),
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setCurrentUserProducts(state, products) {
      state.currentUserProducts = products;
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
    async fetchProductsByOwner({ commit }, ownerId) {
      const res = await fetchProductsByOwner(ownerId);
      commit("setCurrentUserProducts", res);
    },
    async disassmebleProduct({ commit }, productId) {
      await disassmebleProduct(productId);
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
    ],
    getCurrentUserProducts: (state) => state.currentUserProducts.map(formatAuthors),
    getAddColumn: (state) => state.tableColumnAdd,
    getUserColumn: (state) => state.tableColumnOwner,
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
    contentOf: product.contentOf ? "Yes" : "No",
  };
}