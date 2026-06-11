import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import { useOrganizationsStore } from "./organizations";
import {
  fetchProductsByOrganization,
  postProduct,
  fetchProductsByOwner,
  disassmebleProduct,
  transferProduct,
  updateProduct,
  getProduct,
  getAllProductsByResource,
  fetchPicture,
} from "@/services/HttpClientService";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    currentUserProducts: [],
    selectedProduct: {},
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
    tableColumnAdd: { key: "add", title: "", slot: "add" },
    tableColumnOwner: {
      key: "owner",
      title: "Owner",
      slot: "owner",
    },
    tableColumnOrganization: {
      key: "organization",
      title: "Organization",
      slot: "organization",
    },
    tableActions: {
      key: "actions",
      title: "",
      align: "center",
    },
    tableColumnResourceQuantity: {
      key: "quantity",
      title: "Quantity",
    },
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
    tableColumnDiscount: {
      key: "discount",
      title: "Discount",
    },
    tableColumnAdditionalPrice: {
      key: "additionalPrice",
      title: "AdditionalPrice",
    },
  }),
  getters: {
    getProductById: (state) => (productId) =>
      state.products.find((product) => product.id === productId),
    getColumns: (state) => [
      ...state.tableColumns,
      state.tableColumnResourcesContent,
      state.tableColumnProductsContent,
    ],
    getDisassembleAndUserColumns: (state) => [
      state.tableColumnOwner,
      state.tableColumnOrganization,
      state.tableActions,
    ],
    getAdditionalBaseColumns: (state) => [
      state.tableColumnOwner,
      state.tableColumnDiscount,
      state.tableColumnAdditionalPrice,
    ],
  },
  actions: {
    async fetchProducts() {
      const organizationsStore = useOrganizationsStore();

      await organizationsStore.fetchOrganizations();
      let orgs = organizationsStore.organizations;

      const allProducts = [];

      await Promise.all(
        orgs.map(async (org) => {
          const orgProductsResponse = await fetchProductsByOrganization(org.id);
          const orgProducts = orgProductsResponse.products;

          orgProducts.forEach((product) => {
            allProducts.push({
              ...product,
              organization: org,
            });
          });
        }),
      );

      this.products = allProducts;
    },
    async createProduct(product) {
      const res = await postProduct(product);
      return res;
    },
    async fetchProductsByOwner(ownerId) {
      const res = await fetchProductsByOwner(ownerId);
      this.currentUserProducts = res;
    },
    async fetchProductsByOrganization(ownerId) {
      return await fetchProductsByOrganization(ownerId);
    },
    async disassmebleProduct(productId) {
      await disassmebleProduct(productId);
    },
    async transferProduct(data) {
      const { productId, recipientId } = data;
      await transferProduct(productId, recipientId);
    },
    async postPicture({ productId, image }) {
      await postPicture(productId, image);
    },
    async updateProduct({ productId, updatedProduct }) {
      return await updateProduct(productId, updatedProduct);
    },
    async fetchAllProductsByResource(resourceId) {
      return await getAllProductsByResource(resourceId);
    },
    async fetchPicture(productId) {
      try {
        const res = await fetchPicture(productId);
        return URL.createObjectURL(new Blob([res], { type: "image/png" }));
      } catch (error) {
        return null;
      }
    },
    async fetchProduct(id) {
      const data = await getProduct(id);
      this.selectedProduct = data;
      return data;
    },
  },
  persist: {
    key: STORAGE_KEYS.PRODUCTS,
    storage: storageService.getStorage(),
  },
});
