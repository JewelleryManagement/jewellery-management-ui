import { createStore } from "vuex";
import resourcesModule from "./modules/resources";
import productsModule from "./modules/products";
import usersModule from "./modules/users";

const store = createStore({
  modules: {
    resources: resourcesModule,
    products: productsModule,
    users: usersModule,
  },
});

export default store;
