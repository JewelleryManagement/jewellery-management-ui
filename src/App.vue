<template>
  <suspense>
    <template #default>
      <v-app>
        <NavBar v-if="isAuth" :navBarButtons="navBarButtons" />
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

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, provide, computed } from "vue";

import NavBar from "./components/Nav/NavBar.vue";
import SnackBar from "./components/Popup/SnackBar.vue";

const store = useStore();
const router = useRouter();

const isAuth = computed(() => store.getters["auth/isAuthenticated"]);

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
    snackbarProvider.showSnackbar(message, "success", 4000, "bottom center"),
  showErrorSnackbar: (message) =>
    snackbarProvider.showSnackbar(message, "error", 4000, "bottom center"),
};

provide("snackbarProvider", snackbarProvider);

const logoutHandler = () => {
  store.dispatch("auth/logout");
  snackbarProvider.showSuccessSnackbar("Logged out successfully!");
  router.push("/login");
};

const mainMenuPages = [
  {
    link: { text: "Home", url: "/" },
    icon: "mdi-home",
    active: false,
  },
  {
    link: { text: "Users", url: "/users" },
    children: [
      { text: "All Users", url: "/users" },
      { text: "Create User", url: "/users/create" },
    ],
    icon: "mdi-account-multiple",
    active: false,
  },
  {
    link: { text: "All Resources", url: "/resources" },
    children: [
      { text: "Add Resource", url: "/resources/add" },
      { text: "All", url: "/resources" },
    ],
    icon: "mdi-diamond-stone",
    active: false,
  },
  {
    link: { text: "Pearls", url: "/resources" },
    children: [
      {
        text: "Add Pearl",
        url: "/resources/add",
        query: { clazz: "Pearl" },
      },
      {
        text: "Strand",
        url: "/resources",
        query: { clazz: "Pearl", quantityType: "Strand" },
      },
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "Pearl", quantityType: "Piece" },
      },
    ],
    icon: "mdi-alpha-p-box-outline",
    active: false,
  },
  {
    link: { text: "Diamond", url: "/resources" },
    children: [
      {
        text: "Add Diamond",
        url: "/resources/add",
        query: { clazz: "Diamond" },
      },
      {
        text: "Natural",
        url: "/resources",
        query: { clazz: "Diamond", type: "Natural" },
      },
      {
        text: "Lab Grown",
        url: "/resources",
        query: { clazz: "Diamond", type: "Lab Grown" },
      },
    ],
    icon: "mdi-alpha-d-box-outline",
    active: false,
  },
  {
    link: { text: "Diamond Melee", url: "/resources" },
    children: [
      {
        text: "Add Diamond Melee",
        url: "/resources/add",
        query: { clazz: "DiamondMelee" },
      },
      {
        text: "Natural Melee",
        url: "/resources",
        query: { clazz: "DiamondMelee", type: "Natural" },
      },
      {
        text: "Lab Grown Melee",
        url: "/resources",
        query: { clazz: "DiamondMelee", type: "LabGrown" },
      },
    ],
    icon: "mdi-alpha-d-box",
    active: false,
  },
  {
    link: { text: "Colored Stone", url: "/resources" },
    children: [
      {
        text: "Add Colored Stone",
        url: "/resources/add",
        query: { clazz: "ColoredStone" },
      },
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "ColoredStone", quantityType: "Piece" },
      },
    ],
    icon: "mdi-alpha-c-box-outline",
    active: false,
  },
  {
    link: { text: "Colored Stone Melee", url: "/resources" },
    children: [
      {
        text: "Add Colored Stone Melee",
        url: "/resources/add",
        query: { clazz: "ColoredStoneMelee" },
      },
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "ColoredStoneMelee", quantityType: "Piece" },
      },
    ],
    icon: "mdi-alpha-c-box",
    active: false,
  },
  {
    link: { text: "Semi Precious", url: "/resources" },
    children: [
      {
        text: "Add Semi Precious Stone",
        url: "/resources/add",
        query: { clazz: "SemiPreciousStone" },
      },
      {
        text: "Strand",
        url: "/resources",
        query: { clazz: "SemiPreciousStone", quantityType: "Strand" },
      },
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "SemiPreciousStone", quantityType: "Piece" },
      },
    ],
    icon: "mdi-alpha-s-box-outline",
    active: false,
  },
  {
    link: { text: "Metal", url: "/resources" },
    children: [
      {
        text: "Add Metal",
        url: "/resources/add",
        query: { clazz: "Metal" },
      },
      {
        text: "Gold",
        url: "/resources",
        query: { clazz: "Metal", type: "Gold" },
      },
      {
        text: "Silver",
        url: "/resources",
        query: { clazz: "Metal", type: "Silver" },
      },
      {
        text: "Platinum",
        url: "/resources",
        query: { clazz: "Metal", type: "Platinum" },
      },
      {
        text: "Other",
        url: "/resources",
        query: { clazz: "Metal", type: "Other" },
      },
    ],
    icon: "mdi-alpha-m-box-outline",
    active: false,
  },
  {
    link: { text: "Element", url: "/resources" },
    children: [
      {
        text: "Add Element",
        url: "/resources/add",
        query: { clazz: "Element" },
      },
      {
        text: "All Elements",
        url: "/resources",
        query: { clazz: "Element" },
      },
    ],
    icon: "mdi-alpha-e-box-outline",
    active: false,
  },
  {
    link: { text: "Products", url: "/products" },
    children: [
      { text: "All Products", url: "/products" },
      { text: "Create Product", url: "/products/add" },
    ],
    icon: "mdi-package-variant",
    active: false,
  },
  {
    link: { text: "Sales", url: "/sales" },
    children: [
      { text: "All Sales", url: "/sales" },
      { text: "New Sale", url: "/sales/add" },
    ],
    icon: "mdi-cart-outline",
    active: false,
  },
  {
    link: { text: "Organizations", url: "/organizations" },
    children: [
      { text: "All Organizations", url: "/organizations" },
      { text: "New Organization", url: "/organizations/add" },
    ],
    icon: "mdi-domain",
    active: false,
  },
  {
    link: { text: "Profile", url: "/profile" },
    children: [
      { text: "Details", url: "/profile" },
      { text: "Logout", action: logoutHandler },
    ],
    icon: "mdi-account",
    active: false,
  },
];

const navBarButtons = ref(mainMenuPages);
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
