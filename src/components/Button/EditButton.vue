<template>
  <router-link :to="routerPath" @click.stop>
    <v-icon color="green">mdi-pencil</v-icon>
  </router-link>
</template>
  
  <script setup>
import { defineProps } from "vue";

const props = defineProps({
  routerPath: {
    type: String,
    required: true,
  },
});
</script>
  
  <style scoped></style>
  