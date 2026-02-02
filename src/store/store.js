import { createStore } from "vuex";
import resourcesModule from "./modules/resources";
import productsModule from "./modules/products";
import usersModule from "./modules/users";
import authModule from "./modules/auth";
import salesModule from "./modules/sales";
import organizationsModule from "./modules/organizations";
import allowedValuesModule from "./modules/allowedValues";
import VuexPersistence from "vuex-persist";
import systemEventsModule from "./modules/systemEvents";

const PERSIST_KEY = "vuex";
const STORE_VERSION = 1;
const VERSION_KEY = "store_version";

const savedVersion = Number(localStorage.getItem(VERSION_KEY) || 0);
if (savedVersion !== STORE_VERSION) {
  localStorage.removeItem(PERSIST_KEY);
  localStorage.setItem(VERSION_KEY, String(STORE_VERSION));
}

const vuexLocal = new VuexPersistence({
  key: PERSIST_KEY,
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
    systemEvents: systemEventsModule,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
