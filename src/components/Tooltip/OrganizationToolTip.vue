<template>
  <router-link
    v-if="props.organization"
    :to="`/organizations/${props.organization.id}`"
  >
    {{ props.organization.name }}<slot></slot>
    <v-tooltip activator="parent" location="top">
      <div>Name: {{ props.organization.name }}</div>
      <div>Address: {{ props.organization.address }}</div>
      <div>Note: {{ props.organization.note }}</div>
    </v-tooltip>
  </router-link>
</template>
  
  <script setup>
const props = defineProps({
  organization: Object,
});
</script>
  
  <style scoped>
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  color: blue;
}
</style>
  