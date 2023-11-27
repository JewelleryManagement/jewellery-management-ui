<template>
  <router-link
    style="text-decoration: none; color: inherit"
    :to="`/users/${props.user.id}`"
  >
    <div>{{ props.user.name }}</div>
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
