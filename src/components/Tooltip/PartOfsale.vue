<template>
  <span v-if="props.partOfSale">
    <router-link :to="`/sales/${props.partOfSale}`">Yes</router-link>
  </span>
  <slot v-else></slot>
</template>

<script setup>
const props = defineProps({
  partOfSale: String,
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
