<template>
  <router-link v-if="props.user" :to="`/users/${props.user.id}`">
    {{ props.user.firstName }}
    <v-tooltip activator="parent" location="top">
      <div>First Name: {{ props.user.firstName }}</div>
      <div>Last Name: {{ props.user.lastName }}</div>
      <div>Email: {{ props.user.email }}</div>
    </v-tooltip>
  </router-link>
</template>

<script setup>
const props = defineProps({
  user: Object,
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  transition: transform 0.2s ease;
}
a:hover {
  color: blue;
  transform: scale(1.1);
}
</style>
