import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
const app = createApp(App);
registerPlugins(app);
import ResourceContentDialog from "@/components/Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "@/components/Dialog/ProductsContentDialog.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue"


app.component('disassembly-button', DisassemblyButton)
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductsContentDialog);
app.mount("#app");
