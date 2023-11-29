<template>
  <router-link :to="`/users/${props.user.id}`">
    {{ props.user.name }}<slot></slot>
    <v-tooltip activator="parent" location="top">
      <div>Name: {{ props.user.name }}</div>
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
}
a:hover {
  color: blue;
}
</style>
