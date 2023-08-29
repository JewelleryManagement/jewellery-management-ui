<template>
  <v-app>
    <NavBar :pages="pages" />
    <v-main>
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </v-main>
    <SnackBar
      :isActive="snackbar.isActive"
      :message="snackbar.message"
      :color="snackbar.color"
      :location="snackbar.location"
      :timeout="snackbar.timeout"
      :width="snackbar.width"
    />
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
    SnackBar,
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
      message: "",
      color: "success",
      timeout: 3000,
      location: "top center",
      width: 100,
    });

    const showSnackbar = ({
      message,
      color,
      timeout,
      location = "top center",
    }) => {
      snackbar.value.isActive = true;
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.timeout = timeout;
      snackbar.value.location = location;

      setTimeout(() => {
        snackbar.value.isActive = false;
      }, timeout);
    };

    provide("snackbar", snackbar);
    provide("showSnackbar", showSnackbar);

    return { pages, snackbar };
  },
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

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
