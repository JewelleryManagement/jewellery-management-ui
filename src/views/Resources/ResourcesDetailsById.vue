<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
  </v-container>
</template>

<script setup>
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const resourceId = route.params.id;
const resourceAvailability = ref(
  await store.dispatch("resources/fetchAvailabilityResourceById", resourceId)
);
</script>
