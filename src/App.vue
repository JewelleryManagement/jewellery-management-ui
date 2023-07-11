<template>
  <NavBar
    :pages="pages"
    :active-page="activePage"
    :navLinksClick="(index) => (activePage = index)"
  />
  <PageViewer :page="pages[activePage]" />
</template>

<script>
import NavBar from "./components/Nav/NavBar.vue";
import PageViewer from "./components/PageViewer.vue";

export default {
  name: "App",
  components: {
    NavBar,
    PageViewer,
  },
  data() {
    return {
      activePage: 0,
      pages: [
        {
          link: { text: "Home", url: "index.html" },
          pageTitle: "Home Page",
          content: "This is the home content",
        },
        {
          link: { text: "Users", url: "users.html" },
          pageTitle: "Users Page",
          content: "This is the users content",
        },
        {
          link: { text: "Resources", url: "resources.html" },
          pageTitle: "Resources Page",
          content: "This is the resources content",
        },
      ],
    };
  },
};
</script>

<style>
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
</style>
