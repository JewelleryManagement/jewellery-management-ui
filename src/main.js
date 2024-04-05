import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
const app = createApp(App);
registerPlugins(app);

import {
  ResourceContentDialog,
  ProductTransferDialog,
  UserResourceForm,
  DisassemblyButton,
  FormButtons,
  UserToolTip,
  ProductTransferButton,
  BaseCard,
  PictureButton,
  BarCode,
  PartOfProduct,
  TableButton,
  ReturnProductButton,
} from "@/components";

app.component("bar-code", BarCode);
app.component("base-card", BaseCard);
app.component("form-buttons", FormButtons);
app.component("table-button", TableButton);
app.component("user-tool-tip", UserToolTip);
app.component("picture-button", PictureButton);
app.component("part-of-product", PartOfProduct);
app.component("disassembly-button", DisassemblyButton);
app.component("user-resource-form", UserResourceForm);
app.component("return-product-button", ReturnProductButton);
app.component("product-transfer-button", ProductTransferButton);
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductTransferDialog);
app.mount("#app");
