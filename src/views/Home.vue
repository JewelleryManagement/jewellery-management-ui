<template>
  <v-container fluid class="pa-0">
    <EventTimeline class="w-100" :events="events" />
  </v-container>
</template>

<script setup>
import { onBeforeMount, inject, ref } from "vue";
import EventTimeline from "./Events/EventTimeline.vue";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useResourcesStore } from "@/store/resources";

const systemEventsStore = useSystemEventsStore();
const resourcesStore = useResourcesStore();

const snackbarProvider = inject("snackbarProvider");

const events = ref([]);

onBeforeMount(async () => {
  try {
    await resourcesStore.buildResourcesQueries();
    events.value = await systemEventsStore.fetchAllEvents();
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch globally!");
  }
});
</script>
