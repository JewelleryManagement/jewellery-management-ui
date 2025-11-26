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
      // { text: "Pearl", url: "/resources", query: { filter: "Pearl" } },
      // { text: "Metal", url: "/resources", query: { filter: "Metal" } },
      // { text: "Element", url: "/resources", query: { filter: "Element" } },
      // {
      //   text: "PreciousStone",
      //   url: "/resources",
      //   query: { filter: "PreciousStone" },
      // },
      // {
      //   text: "SemiPreciousStone",
      //   url: "/resources",
      //   query: { filter: "SemiPreciousStone" },
      // },
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
        text: "Natural",
        url: "/resources",
        query: { clazz: "Diamond", quantityType: "Natural" },
      },
      {
        text: "Lab Grown",
        url: "/resources",
        query: { clazz: "Diamond", quantityType: "LabGrown" },
      },
      {
        text: "Natural Melee",
        url: "/resources",
        query: { clazz: "Diamond", quantityType: "NaturalMelee" },
      },
      {
        text: "Lab Grown Melee",
        url: "/resources",
        query: { clazz: "Diamond", quantityType: "LabGrownMelee" },
      },
    ],
    icon: "mdi-alpha-d-box-outline",
    active: false,
  },
  {
    link: { text: "Colored Stone", url: "/resources" },
    children: [
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "ColoredStone", quantityType: "Piece" },
      },
      {
        text: "Melee",
        url: "/resources",
        query: { clazz: "ColoredStone", quantityType: "Melee" },
      },
    ],
    icon: "mdi-alpha-c-box-outline",
    active: false,
  },
  {
    link: { text: "Semi Precious", url: "/resources" },
    children: [
      {
        text: "Strand",
        url: "/resources",
        query: { clazz: "SemiPrecious", quantityType: "Strand" },
      },
      {
        text: "Piece",
        url: "/resources",
        query: { clazz: "SemiPrecious", quantityType: "Piece" },
      },
    ],
    icon: "mdi-alpha-s-box-outline",
    active: false,
  },
  {
    link: { text: "Metals", url: "/resources" },
    children: [
      {
        text: "Gold",
        url: "/resources",
        query: { clazz: "Metals", quantityType: "Gold" },
      },
      {
        text: "Silver",
        url: "/resources",
        query: { clazz: "Metals", quantityType: "Silver" },
      },
      {
        text: "Platinum",
        url: "/resources",
        query: { clazz: "Metals", quantityType: "Platinum" },
      },
      {
        text: "Other",
        url: "/resources",
        query: { clazz: "Metals", quantityType: "Other" },
      },
    ],
    icon: "mdi-alpha-m-box-outline",
    active: false,
  },
  {
    link: { text: "Clasp and Components", url: "/resources" },
    children: [
      {
        text: "Pre-made",
        url: "/resources",
        query: { clazz: "ClaspAndComponents", quantityType: "Pre-made" },
      },
      {
        text: "Crafted",
        url: "/resources",
        query: { clazz: "ClaspAndComponents", quantityType: "Crafted" },
      },
    ],
    icon: "mdi-closed-caption-outline",
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
