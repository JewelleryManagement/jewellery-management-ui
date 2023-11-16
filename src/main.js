import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
const app = createApp(App);
registerPlugins(app);
import ResourceContentDialog from "@/components/Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "@/components/Dialog/ProductsContentDialog.vue";
import UserResourceForm from "@/components/Form/UserResourceForm"
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue"
import SubmitButtons from "@/components/Button/SubmitButtons.vue"
import UserToolTip from './components/Tooltip/UserToolTip.vue'

app.component('user-tool-tip', UserToolTip)
app.component('submit-buttons', SubmitButtons)
app.component('user-resource-form', UserResourceForm)
app.component('disassembly-button', DisassemblyButton)
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductsContentDialog);
app.mount("#app");
