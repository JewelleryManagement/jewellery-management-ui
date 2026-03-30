<template>
  <v-container fluid class="pa-0">
    <EventTimeline class="w-100" :events="events" />
  </v-container>
</template>

<script setup>
import { onBeforeMount, inject } from "vue";
import EventTimeline from "./Events/EventTimeline.vue";
import { useUsersStore } from "@/store/users";
import { useProductsStore } from "@/store/products";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useResourcesStore } from "@/store/resources";

const userStore = useUsersStore();
const productsStore = useProductsStore();
const systemEventsStore = useSystemEventsStore();
const resourcesStore = useResourcesStore();

const snackbarProvider = inject("snackbarProvider");

onBeforeMount(async () => {
  try {
    await Promise.all([
      userStore.fetchUsers(),
      resourcesStore.fetchResources(),
      productsStore.fetchProducts(),
      resourcesStore.buildResourcesQueries(),
    ]);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch globally!");
  }
});

const events = await systemEventsStore.fetchAllEvents();
</script>
