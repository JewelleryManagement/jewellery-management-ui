<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <v-app>
    <v-main>
      <NavBar :pages="pages" />

      <SnackBar
        v-model="snackbar.isActive"
        :isActive="snackbar.isActive"
        :message="snackbar.message"
        :color="snackbar.color"
        :location="snackbar.location"
        :timeout="snackbar.timeout"
        :width="snackbar.width"
      />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/Nav/NavBar.vue";
import SnackBar from "./components/ui/SnackBar.vue";
import { ref, provide } from "vue";


export default {
  name: "App",
  components: {
    NavBar,
    SnackBar
  },
  setup() {
    const pages = ref([
      {
        link: { text: "Home", url: "/" },
      },
      {
        link: { text: "Users", url: "/users" },
      },
      {
        link: { text: "Resources", url: "/resources" },
      },
      {
        link: { text: "Products", url: "/products" },
      },
    ]);

    const snackbar = ref({
      isActive: false,
      message: '',
      color: 'success',
      timeout: 3000,
      width: 250
    });

    const showSnackbar = (message, color, timeout, location = 'bottom cemter') => {
      snackbar.value.isActive = true;
      snackbar.value.color = color;
      snackbar.value.message = message;
      snackbar.value.timeout = timeout;
      snackbar.value.location = location;
    };

    provide('snackbar', snackbar);
    provide('showSnackbar', showSnackbar);

    return { pages, snackbar, showSnackbar };
  }
};
</script>



<style>
:root {
  --clr-white: #fff;
  --clr-living-coral: #ff6f61;
  --clr-inkwell: #363945;

  --trans: all 400ms ease;

  --container-width-lg: 75%;
  --container-width-md: 86%;
  --container-width-sm: 90%;
}

#app {
  /* CSS Reset */

  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin and padding */
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
    padding: 0;
  }

  /* Remove list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Remove default hyperlink styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Remove outline on focus */
  a:focus,
  button:focus {
    outline: none;
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
  }

  /* Remove table border spacing */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
}

.container {
  max-width: var(--container-width-lg);
  background-color: transparent;
  margin: 0 auto;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  min-height: 100vh;
  text-align: center;
}
</style>