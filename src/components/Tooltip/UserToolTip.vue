<template>
  <router-link :to="`/users/${props.user.id}`">
    {{ props.user.firstName }}<slot></slot>
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
console.log(props)
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
