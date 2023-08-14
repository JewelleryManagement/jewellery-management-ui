import { createStore } from "vuex";
import tablesModule from "./modules/tables";

const store = createStore({
  tables: tablesModule,
});


export default store;
