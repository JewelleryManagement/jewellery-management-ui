import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
const app = createApp(App);
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
  ProductsContentDialog,
  OrgTable,
} from "@/components";

app.component("bar-code", BarCode);
app.component("org-table", OrgTable);
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
app.component("product-transfer-button", ProductTransferButton);
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductsContentDialog);
app.mount("#app");
