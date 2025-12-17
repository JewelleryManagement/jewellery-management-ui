<template>
  <v-container class="d-flex flex-column align-center">
    <!-- <PageViewer :pageTitle="pageTitle" :content="content" /> -->
    <Event :events="events" />
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, inject, onMounted } from "vue";
import PageViewer from "../components/PageViewer.vue";
import Event from "@/event/Event.vue";
import { useStore } from "vuex";
import { getAllEvents } from "@/services/HttpClientService";
const store = useStore();
const pageTitle = ref("Home Page");
const content = ref("This is the home content");
const snackbarProvider = inject("snackbarProvider");

const events = ref([]);
events.value = await getAllEvents();

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
</script>
