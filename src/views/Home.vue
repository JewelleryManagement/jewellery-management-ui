<template>
  <v-container fluid class="pa-0">
    <EventTimeline class="w-100" :events="events" />
  </v-container>
</template>

<script setup>
import { onBeforeMount, inject } from "vue";
import EventTimeline from "./Events/EventTimeline.vue";
import { useStore } from "vuex";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");

onBeforeMount(async () => {
  try {
    await Promise.all([
      store.dispatch("users/fetchUsers"),
      store.dispatch("resources/fetchResources"),
      store.dispatch("products/fetchProducts"),
      store.dispatch("resources/buildResourcesQueries"),
    ]);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch globally!");
  }
});

const events = await store.dispatch("systemEvents/getAllEvents");
</script>
