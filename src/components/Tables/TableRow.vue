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
th,
td:hover {
  cursor: pointer;
}
</style>
