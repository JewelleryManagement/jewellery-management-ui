export default {
  namespaced: true,
  state: {
    products: [
      { productName: "Product 1", price: 10, discount: 0 },
      { productName: "Product 2", price: 15, discount: 5 },
      { productName: "Product 3", price: 123, discount: 15 },
    ],
    tableColumns: [
      { key: "productName", title: "Product Name" },
      { key: "price", title: "Price" },
      { key: "discount", title: "Discount" },
    ],
  },
  mutations: {},
  actions: {},
  getters: {
    getProducts: (state) => state.products,
    getColumns: (state) => [...state.tableColumns],
  },
};
