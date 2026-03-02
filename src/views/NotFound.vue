<template>
  <v-container class="my-16">
    <v-card class="mx-auto pa-6" max-width="560">
      <div class="text-center">
        <h2 class="text-h5 font-weight-medium mb-3">{{ title }}</h2>

        <v-icon size="56" color="error" class="mb-4">
          mdi-alert-circle-outline
        </v-icon>

        <p class="text-body-1 mb-6">{{ description }}</p>

        <text-button color="blue" text="Go back" @click="goBack" />
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { computed, ref } from "vue";
import TextButton from "@/components/Button/TextButton.vue";

const router = useRouter();
const route = useRoute();

const type = computed(() => route.query.type || "");

const title = computed(() => {
  return type.value ? `${type.value} not found` : "Page not found";
});

const description = computed(() => {
  return type.value
    ? `The requested ${type.value.toLowerCase()} was not found or may have been deleted.`
    : "We’re sorry, the page you requested could not be found. Please go back or return home.";
});

const goBack = () => router.back();

const didReplace = ref(false);

onBeforeRouteLeave((to) => {
  if (didReplace.value) return true;

  didReplace.value = true;
  return { ...to, replace: true };
});
</script>

<style scoped></style>
