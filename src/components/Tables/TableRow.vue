<template>
  <tr>
    <td v-for="column in columns" :key="column.key">
      {{ data[column.key] || "N/A" }}
    </td>
  </tr>
</template>

<script>
export default {
  props: ["data", "columns"],
};
</script>

<style scoped>
td {
  padding: 0.5rem;
  text-align: left;
}

tr {
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
}

tr:hover {
  background-color: #424553;
  cursor: pointer;
}
</style>
