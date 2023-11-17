import { fetchSales, postSale } from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    sales: [],
    tableColumns: [
      { key: "seller", title: "Seller" },
      { key: "buyer", title: "Buyer" },
      { key: "products", title: "Products", align: "center" },
      { key: "totalPrice", title: "Total Price" },
      { key: "totalDiscountedPrice", title: "Discount" },
      { key: "totalDiscount", title: "Final price" },
    ],
  },
  mutations: {
    setSales(state, sales) {
      state.sales = sales.map((product) => ({
        ...product,
        totalPrice: `€${product.totalPrice}`,
        totalDiscountedPrice: `${(+product.totalDiscountedPrice).toFixed(2)}%`,
        totalDiscount: `€${(+product.totalDiscount).toFixed(2)}`,  
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
  },
};
