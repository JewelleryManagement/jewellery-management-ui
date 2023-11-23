<template>
  <suspense>
    <template #default>
      <v-app>
        <NavBar
          v-if="isAuth"
          :defaultMenuPages="defaultMenuPages"
          :hamburgerMenuPages="hamburgerMenuPages"
        />
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
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, provide, computed } from "vue";

export default {
  name: "App",
  components: {
    NavBar,
    SnackBar,
  },
  setup() {
    const store = useStore();
    const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
    const router = useRouter();

    const snackbar = ref({
      isActive: false,
      message: "",
      color: "success",
      timeout: 3000,
      location: "top center",
      width: 100,
    });

    const snackbarProvider = {
      showSnackbar: (message, color, timeout, location = "top center") => {
        snackbar.value.isActive = true;
        snackbar.value.message = message;
        snackbar.value.color = color;
        snackbar.value.timeout = timeout;
        snackbar.value.location = location;

        setTimeout(() => {
          snackbar.value.isActive = false;
        }, timeout);
      },

      showSuccessSnackbar: (message) =>
        snackbarProvider.showSnackbar(
          message,
          "success",
          4000,
          "bottom center"
        ),
      showErrorSnackbar: (message) =>
        snackbarProvider.showSnackbar(message, "error", 4000, "bottom center"),
    };

    provide("snackbarProvider", snackbarProvider);

    const logoutHandler = () => {
      store.dispatch("auth/logout");
      snackbarProvider.showSuccessSnackbar("Logged out successfully!");
      router.push("/login");
    };

    const navToProfile = () => {
      router.push("/profile");
    };

    const mainMenuPages = [
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
      {
        link: { text: "Sales", url: "/sales" },
      },
    ];

    const profileDropdown = {
      isMenuDropdown: true,
      link: {
        text: "Profile",
        url: "/profile",
        dropdown: [
          { clickHandler: navToProfile, text: "Details" },
          { clickHandler: logoutHandler, text: "Logout" },
        ],
      },
    };

     const hamburgerMenuPages = ref([
      ...mainMenuPages,
      {
        link: {
          text: "Profile",
          url: "/profile",
        },
      },
      {
        clickHandler: logoutHandler,
        link: { text: "Logout", url: "/logout" },
      },
    ]);

    const defaultMenuPages = ref([...mainMenuPages, profileDropdown]);

    return { defaultMenuPages, hamburgerMenuPages, snackbar, isAuth };
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
