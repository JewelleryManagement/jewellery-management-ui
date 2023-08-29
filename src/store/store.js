import { createStore } from "vuex";
import resourcesModule from "./modules/resources";
import productsModule from "./modules/products";
import usersModule from "./modules/users";
import VuexPersistence from 'vuex-persist' 

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const store = createStore({
  modules: {
    resources: resourcesModule,
    products: productsModule,
    users: usersModule,
  },
  plugins: [vuexLocal.plugin]

});

export default store;
