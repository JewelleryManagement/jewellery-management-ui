<template>
  <router-link to="/home">
    <v-img
      :class="`mx-${offset}`"
      src="@/assets/logo.png"
      :max-height="size"
      :max-width="size"
      :min-height="size"
      :min-width="size"
      contain
    />
  </router-link>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
  },
  offset: {
    type: [Number, String],
  },
});
</script>

<style scoped></style>
