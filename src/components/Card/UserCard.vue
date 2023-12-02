<template>
  <v-card class="mx-auto pa-10 elevation-12" max-width="500" height="auto">
    <v-card-title class="text-h6">
      <v-icon>mdi-account</v-icon>
      {{ name }}
    </v-card-title>
    <v-card-text>
      <div>Email: {{ email }}</div>
      <div>Resource Availability: {{ resourcesAndQuantities.length }}</div>
    </v-card-text>
    <v-card-text>
      <div v-for="resource in resourcesAndQuantities" :key="resource.id">
        <p>{{ resource.clazz }} - {{ resource.quantity }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { name, email, resourcesAndQuantities } = defineProps({
  name: String,
  email: String,
  resourcesAndQuantities: Object,
});
</script>

<style scoped></style>
