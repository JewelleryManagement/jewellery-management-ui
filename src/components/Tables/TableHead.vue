<template>
  <tr>
    <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
  </tr>
</template>

<script>
export default {
  props: ["columns"],
};
</script>

<style scoped>
th {
  padding: 0.5rem;
  text-align: left;
  white-space: nowrap;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  border-bottom: 2px solid;
}

th:hover {
  cursor: pointer;
}
</style>
