<template>
  <suspense>
    <template #default>
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
  </suspense>
</template>

<script>
import NavBar from "./components/Nav/NavBar.vue";
import SnackBar from "./components/Popup/SnackBar.vue";
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

    const snackbarProvider = {
      showSnackbar: (message, color, timeout, location) => {
        snackbar.value.isActive = true;
        snackbar.value.message = message;
        snackbar.value.color = color;
        snackbar.value.timeout = timeout;
        snackbar.value.location = location;

        setTimeout(() => {
          snackbar.value.isActive = false;
        }, timeout);
      },
      showSuccessSnackbar: (message) => showSnackbar({message, color: "success", timeout: 4000, location: "bottom center"}),
      showErrorSnackbar: (message) => showSnackbar({message, color: "error", timeout: 4000, location: "bottom center"}),
    };

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
    provide("snackbarProvider", snackbarProvider);

    return { pages, snackbar };
  },
};
</script>

<style>
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
