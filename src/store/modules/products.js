import {
  fetchProducts,
  postProduct,
  fetchProductsByOwner,
  fetchProductsByOrganization,
  disassmebleProduct,
  transferProduct,
  postPicture,
  fetchPicture,
  updateProduct
} from "@/services/HttpClientService.js";

export default {
  namespaced: true,
  state: {
    products: [],
    currentUserProducts: [],
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "catalogNumber", title: "Catalog Number" },
      { key: "productionNumber", title: "Production Number" },
      { key: "description", title: "Description" },
      { key: "authors", title: "Authors", slot: "authors" },
      { key: "partOfSale", title: "Sold", slot: "partOfSale" },
      { key: "salePrice", title: "Sale price", slot: "salePrice" },
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
    tableColumnEdit: {
      key: "edit",
      title: "Edit",
      align: "center",
    },
  },
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
    async fetchProductsByOrganization({ commit }, ownerId) {
      return await fetchProductsByOrganization(ownerId);
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
    async updateProduct({commit}, {productId, updatedProduct}){
      return await updateProduct(productId, updatedProduct)
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
      return state.products;
    },
    getProductById: (state ) => (productId) => {
      return state.products.find(product => product.id === productId)
    },
    getColumns: (state) => [
      ...state.tableColumns,
      state.tableColumnResourcesContent,
      state.tableColumnProductsContent,
    ],
    getCurrentUserProducts: (state) =>
      state.currentUserProducts,
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
