<template>
  <span v-if="props.partOfProduct">
    <router-link
      :to="`/${routerPreFix}/${props.partOfProduct}`"
      :key="props.partOfProduct"
      >Yes</router-link
    >
  </span>
  <span v-else>No</span>
</template>

<script setup>
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const [route, router] = [useRoute(), useRouter()];

const props = defineProps({
  partOfProduct: String,
  routerPreFix: String,
});

watch(
  () => route.fullPath,
  () => router.go(route.fullPath),
);
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
