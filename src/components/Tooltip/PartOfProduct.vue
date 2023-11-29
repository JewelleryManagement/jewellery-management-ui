<template>
  <span v-if="props.partOfProduct">
    <router-link :to="`/${routerPreFix}/${props.partOfProduct}`" :key="props.partOfProduct">Yes</router-link>
  </span>
  <span v-else>{{ props.isPartOfProduct }}</span>
</template>

<script setup>
import {watch} from 'vue'
import { useRoute, useRouter } from 'vue-router';
const [route,router] = [useRoute(), useRouter()] 

const props = defineProps({
  partOfProduct: String,
  isPartOfProduct: String,
  routerPreFix: String,
});

watch(
  () => route.fullPath,
  () => router.go(route.fullPath)
);
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
