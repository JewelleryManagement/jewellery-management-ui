<template>
  <v-card class="mx-auto pa-10 elevation-12" width="500" height="auto">
    <v-card-title class="text-h6">
      <v-icon>mdi-account</v-icon>
      {{ name }}
    </v-card-title>
    <v-card-text>
      <div>Email: {{ email }}</div>
      <div>Resource Availability: {{ resourcesAndQuantities.length }}</div>
      <div
        v-for="resource in resourcesAndQuantities"
        :key="resource.resource.id"
      >
        <p>{{ resource.resource.clazz }} - {{ resource.quantity }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ["name", "email", "resourcesAndQuantities"],
  setup(props) {
    return {
      name: props.name,
      email: props.email,
      resourcesAndQuantities: props.resourcesAndQuantities,
    };
  },
};
</script>

<style scoped></style>
