import { createApp } from 'vue'
import App from './App.vue'
import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";

import { registerPlugins } from '@/plugins'

const app = createApp(App)
registerPlugins(app)


app.component("base-card", BaseCard)
app.component("base-button", BaseButton)
app.mount('#app')
