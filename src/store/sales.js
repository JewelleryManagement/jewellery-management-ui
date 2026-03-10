import { defineStore } from "pinia";
import {
  fetchSales,
  postSale,
  productReturn,
  resourceReturn,
  getAllSalesByResource,
  getSale,
} from "@/services/HttpClientService";
import { useResourcesStore } from "./resources";

export const useSalesStore = defineStore("sales", {
  state: () => ({
    selectedSale: {},
    sales: [],
    tableColumns: [
      { key: "id", title: "Id", align: " d-none" },
      { key: "seller", title: "Seller" },
      { key: "buyer", title: "Buyer" },
      { key: "resources", title: "Resources", align: "center" },
      { key: "products", title: "Products", align: "center" },
      { key: "totalPrice", title: "Total Price" },
      { key: "totalDiscount", title: "Discount" },
      { key: "totalDiscountedPrice", title: "Discounted Price" },
      { key: "date", title: "Date" },
    ],
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
  }),
  getters: {
    getAllColumnsWithQuantity: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
  },
  actions: {
    async fetchSales() {
      const res = await fetchSales();
      this.sales = res;
    },
    async postSale(data) {
      await postSale(data);
    },
    async returnProduct(productId) {
      await productReturn(productId);
    },
    async returnResource(args) {
      await resourceReturn(args.saleId, args.resourceId);
    },
    async getAllSalesByResource(resourceId) {
      return await getAllSalesByResource(resourceId);
    },
    async fetchSale(id) {
      const data = await getSale(id);
      this.selectedSale = data;
      return data;
    },
    getResourceColumns: (state) => {
      const resourcesStore = useResourcesStore();

      return [
        resourcesStore.tableColumnQuantity,
        state.tableColumnPrice,
        state.tableColumnDiscount,
        ...resourcesStore.tableColumns,
        state.tableColumnReturn,
      ];
    },
  },
  persist: {
    key: "sales",
    storage: localStorage,
  },
});
