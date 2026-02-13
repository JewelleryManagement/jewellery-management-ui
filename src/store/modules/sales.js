import {
  fetchSales,
  postSale,
  productReturn,
  resourceReturn,
  getAllSalesByResource,
} from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
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
    tableColumnPrice: { key: "salePrice", title: "Price" },
    tableColumnDiscount: { key: "discount", title: "Discount" },
    tableColumnReturn: { key: "return", title: "Return" },
    tableColumnQuantity: { key: "quantity", title: "Quantity" },
    tableButtons: [
      { label: "Resources", icon: "mdi-diamond-stone" },
      { label: "Products", icon: "mdi-package-variant" },
      {
        label: "Events",
        icon: "mdi-calendar",
      },
    ],
  },
  mutations: {
    setSales(state, sales) {
      state.sales = sales;
    },
  },
  actions: {
    async fetchSales({ commit }) {
      const res = await fetchSales();
      commit("setSales", res);
    },
    async postSale({ commit }, data) {
      await postSale(data);
    },
    async returnProduct({ commit }, productId) {
      await productReturn(productId);
    },
    async returnResource({ commit }, args) {
      await resourceReturn(args.saleId, args.resourceId);
    },
    async getAllSalesByResource({ commit }, resourceId) {
      return await getAllSalesByResource(resourceId);
    },
  },
  getters: {
    getSales: (state) => state.sales,
    getColumns: (state) => [...state.tableColumns],
    getAllColumnsWithQuantity: (state) => [
      state.tableColumnQuantity,
      ...state.tableColumns,
    ],
    getResourceColumns: (state, getters, rootState, rootGetters) => [
      rootState.resources.tableColumnQuantity,
      state.tableColumnPrice,
      state.tableColumnDiscount,
      ...rootState.resources.tableColumns,
      state.tableColumnReturn,
    ],
    getSaleById: (state) => (saleId) => {
      return state.sales.find((sale) => sale.id === saleId);
    },
    getTableButtons: (state) => state.tableButtons,
  },
};
