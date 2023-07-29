<template>
  <NavBar :pages="pages" />

  <router-view />
</template>

<script>
import NavBar from "./components/Nav/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      pages: [
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
      ],
    };
  },
};
</script>

<style>
:root {
  --clr-white: #fff;
  --clr-living-coral: #ff6f61;
  --clr-inkwell: #363945;
  --clr-light-gray: #f2f2f2;
  --clr-dark-gray:  #333;

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
