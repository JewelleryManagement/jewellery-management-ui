import {
  fetchSales,
  postSale,
  productReturn,
  resourceReturn,
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
  },
  mutations: {
    setSales(state, sales) {
      state.sales = sales.map((product) => ({
        ...product,
        totalPrice: `€${(+product.totalPrice).toFixed(2)}`,
        totalDiscount: `${(+product.totalDiscount).toFixed(2)}%`,
        totalDiscountedPrice: `€${(+product.totalDiscountedPrice).toFixed(2)}`,
      }));
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
  },
  getters: {
    getSales: (state) => state.sales,
    getColumns: (state) => [...state.tableColumns],
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
  },
};
