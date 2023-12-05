import { reactive } from "vue";
import {
  fetchProducts,
  postProduct,
  fetchProductsByOwner,
  disassmebleProduct,
  transferProduct,
  postPicture,
  fetchPicture,
} from "@/services/HttpClientService.js";
import { formatProducts } from "../../utils/data-formatter.js";

export default {
  namespaced: true,
  state: reactive({
    products: [],
    currentUserProducts: [],
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "catalogNumber", title: "Catalog Number" },
      { key: "productionNumber", title: "Production Number" },
      { key: "description", title: "Description" },
      { key: "authors", title: "Authors", slot: "authors" },
      { key: "partOfSale", title: "Sold", slot: "partOfSale" },
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
      const res = await postProduct(product);
      return res;
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
      await transferProduct(productId, recipientId);
    },
    async postPicture({ commit }, { productId, image }) {
      await postPicture(productId, image);
    },
    async getPicture({ commit }, productId) {
      try {
        const res = await fetchPicture(productId);
        return URL.createObjectURL(new Blob([res], { type: "image/png" }));
      } catch (error) {
        return null;
      }
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
