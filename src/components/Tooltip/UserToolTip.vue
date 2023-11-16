<template>
  <router-link
    style="text-decoration: none; color: inherit"
    :to="`/users/${props.user.id}`"
  >
    <v-btn variant="plain">
      <v-icon size="25">mdi-account-circle</v-icon>
      <v-tooltip activator="parent" location="top">
        <div>Name: {{ props.user.name }}</div>
        <div>Email: {{ props.user.email }}</div>
      </v-tooltip>
    </v-btn>
  </router-link>
</template>

<script setup>
const props = defineProps({
    user: Object
})
</script>


