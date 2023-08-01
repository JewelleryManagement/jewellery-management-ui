<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
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

.notification-container {
  position: fixed;
  top: 5.3rem;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 20%;
  
}

.notification {
  max-width: 18rem;
  width: 100%;
  min-width: 8rem;
  padding: 2rem 1.5rem;
  color: rgb(255, 255, 255);
  border-radius: 5px;
  font-size: 14px;
  border-radius: 8px;
  opacity: 0;
  transform: translateX(100%);
  transition: opacity 0.3s ease-in-out, transform 0.5s ease-in-out;
  border-radius: 8px;
  margin-bottom: 10px;
  word-wrap: break-word;
  display: flex;
  align-items: center;
}

.notification.show {
  opacity: 1;
  transform: translateX(0%);
  animation: fadeIn 0.5s;
}

.notification .icon {
  font-size: 24px; 
  margin-right: 8px; 
}
.notification.hovered {
  transform: scale(1.1);
  transition: 0.2s ease-in-out;
}

.notification .progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  width: 100%;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.notification .progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #f0f0f06c;
  border-radius: 8px;
  animation: progressBarAnimation 8s linear;
}

@keyframes progressBarAnimation {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
}

.info {
  background: linear-gradient(to left, rgba(1, 68, 92, 0.233), rgb(12, 177, 206));
}

.success {
  background: linear-gradient(to left, rgba(28, 92, 1, 0.233), rgb(12, 206, 31));
}

.error {
  background: linear-gradient(to left, rgba(92, 1, 1, 0.233), rgb(225, 19, 19));
}

.warning {
  background: linear-gradient(to left, rgba(92, 74, 1, 0.233), rgb(225, 170, 19));
}
</style>
