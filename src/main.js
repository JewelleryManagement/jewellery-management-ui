import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const STORE_VERSION = 1;
const VERSION_KEY = "store_version";

const savedVersion = Number(localStorage.getItem(VERSION_KEY) || 0);

if (savedVersion !== STORE_VERSION) {
  localStorage.removeItem("auth");
  localStorage.removeItem("users");
  localStorage.removeItem("resources");
  localStorage.removeItem("products");
  localStorage.removeItem("sales");
  localStorage.removeItem("organizations");
  localStorage.removeItem("allowedValues");
  localStorage.removeItem("systemEvents");

  localStorage.setItem(VERSION_KEY, STORE_VERSION);
}

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
registerPlugins(app);

import {
  ResourceContentDialog,
  OrganizationResourceForm,
  DisassemblyButton,
  FormButtons,
  UserToolTip,
  OrganizationToolTip,
  ProductTransferButton,
  BaseCard,
  PictureButton,
  BarCode,
  PartOfProduct,
  TableButton,
  ReturnProductButton,
  ReturnResourceButton,
  ProductsContentDialog,
  OrganizationsTable,
} from "@/components";

app.component("bar-code", BarCode);
app.component("organizations-table", OrganizationsTable);
app.component("base-card", BaseCard);
app.component("form-buttons", FormButtons);
app.component("table-button", TableButton);
app.component("user-tool-tip", UserToolTip);
app.component("organization-tool-tip", OrganizationToolTip);
app.component("picture-button", PictureButton);
app.component("part-of-product", PartOfProduct);
app.component("disassembly-button", DisassemblyButton);
app.component("org-resource-form", OrganizationResourceForm);
app.component("return-product-button", ReturnProductButton);
app.component("return-resource-button", ReturnResourceButton);
app.component("product-transfer-button", ProductTransferButton);
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductsContentDialog);
app.mount("#app");
