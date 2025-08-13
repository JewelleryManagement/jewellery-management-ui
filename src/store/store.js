import { createStore } from "vuex";
import resourcesModule from "./modules/resources";
import productsModule from "./modules/products";
import usersModule from "./modules/users";
import authModule from "./modules/auth";
import salesModule from "./modules/sales";
import organizationsModule from "./modules/organizations";
import allowedValuesModule from "./modules/allowedValues";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

const store = createStore({
  modules: {
    resources: resourcesModule,
    products: productsModule,
    users: usersModule,
    auth: authModule,
    sales: salesModule,
    organizations: organizationsModule,
    allowedValues: allowedValuesModule,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
