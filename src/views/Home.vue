<template>
  <v-container fluid class="pa-0">
    <EventTimeline class="w-100" :events="events" />
  </v-container>
</template>

<script setup>
import { onBeforeMount, inject } from "vue";
import EventTimeline from "./Events/EventTimeline.vue";
import { useStore } from "vuex";
import { useUsersStore } from "@/store/users";
import { useProductsStore } from "@/store/products";
import { useSystemEventsStore } from "@/store/systemEvents";

const userStore = useUsersStore();
const productsStore = useProductsStore();
const systemEventsStore = useSystemEventsStore();

await userStore.fetchUsers();
await productsStore.fetchProducts();

const store = useStore();
const snackbarProvider = inject("snackbarProvider");

onBeforeMount(async () => {
  try {
    await Promise.all([
      store.dispatch("resources/fetchResources"),
      store.dispatch("resources/buildResourcesQueries"),
    ]);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch globally!");
  }
});

const events = await systemEventsStore.getAllEvents();
</script>
