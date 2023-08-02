import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .component("base-card", BaseCard)
  .component("base-button", BaseButton)
  .mount('#app')
