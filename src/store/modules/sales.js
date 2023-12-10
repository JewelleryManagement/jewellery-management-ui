import { fetchSales, postSale } from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    sales: [],
    tableColumns: [
      { key: "id", title: "Id", align: ' d-none'  },
      { key: "seller", title: "Seller" },
      { key: "buyer", title: "Buyer" },
      { key: "products", title: "Products", align: "center" },
      { key: "totalPrice", title: "Total Price" },
      { key: "totalDiscountedPrice", title: "Discounted Price" },
      { key: "totalDiscount", title: "Discount" },
      { key: "date", title: "Date" },
    ],
  },
  mutations: {
    setSales(state, sales) {
      state.sales = sales.map((product) => ({
        ...product,
        totalPrice: `€${product.totalPrice}`,
        totalDiscountedPrice: `${(+product.totalDiscount).toFixed(2)}%`,
        totalDiscount: `€${(+product.totalDiscountedPrice).toFixed(2)}`,
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
  },
  getters: {
    getSales: (state) => state.sales,
    getColumns: (state) => [...state.tableColumns],
    getSaleById: (state) => (saleId) => {
      return state.sales.find((sale) => sale.id === saleId);
    },
  },
};
