<template>
  <tr>
    <th v-for="column in columns" :key="column.id">{{ column.label }}</th>
  </tr>
</template>

<script>
export default {
  props: ["columns"],
};
</script>

<style scoped>
th {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
  white-space: nowrap;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
}

th:hover {
  cursor: pointer;
}
</style>
