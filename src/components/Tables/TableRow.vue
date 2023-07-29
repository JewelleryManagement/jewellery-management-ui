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

<style>
td {
  padding: 0.5rem;
  text-align: left;
}

tr {
  background-color: var(--clr-light-gray);
  color: var(--clr-dark-gray);
}

tr:hover {
  background-color: #ccc;
  cursor: pointer;
}
</style>
