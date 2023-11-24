import { reactive } from "vue";
import {
  fetchProducts,
  postProduct,
  fetchProductsByOwner,
  disassmebleProduct,
  transferProduct,
} from "@/services/HttpClientService.js";
import { formatProducts } from '../../utils/utils.js'

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
      { key: "partOfSale", title: "Sold" },
      { key: "salePrice", title: "Sale price" },
      { key: "contentOf", title: "Part of product" },
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
    tableColumnTransfer: {
      key: "transfer",
      title: "Transfer",
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
    async transferProduct({ commit }, data) {
      const { productId, recipientId } = data;
      await transferProduct(productId, recipientId)
    },
  },
  getters: {
    allProducts: (state) => {
      return state.products.map(formatProducts);
    },
    getColumns: (state) => [
      ...state.tableColumns,
      state.tableColumnResourcesContent,
      state.tableColumnProductsContent,
    ],
    getCurrentUserProducts: (state) =>
      state.currentUserProducts.map(formatProducts),
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
