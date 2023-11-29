import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
const app = createApp(App);
registerPlugins(app);
import ResourceContentDialog from "@/components/Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "@/components/Dialog/ProductsContentDialog.vue";
import UserResourceForm from "@/components/Form/UserResourceForm"
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue"
import FormButtons from "@/components/Button/FormButtons.vue"
import UserToolTip from './components/Tooltip/UserToolTip.vue'
import ProductTransferButton from "@/components/Button/ProductTransferButton.vue"
import BaseCard from './components/Card/BaseCard.vue'
import PictureButton from "@/components/Button/PictureButton.vue"
import BarCode from "@/components/Barcode/BarCode.vue";
import PartOfProduct from "@/components/Tooltip/PartOfProduct.vue"

app.component('bar-code', BarCode)
app.component('base-card', BaseCard)
app.component('form-buttons', FormButtons)
app.component('user-tool-tip', UserToolTip)
app.component('picture-button', PictureButton)
app.component('part-of-product', PartOfProduct)
app.component('disassembly-button', DisassemblyButton)
app.component('user-resource-form', UserResourceForm)
app.component('product-transfer-button', ProductTransferButton)
app.component("resource-content-dialog", ResourceContentDialog);
app.component("products-content-dialog", ProductsContentDialog);
app.mount("#app");
