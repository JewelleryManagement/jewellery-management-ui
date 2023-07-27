<template>
  <div class="resource-table">
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>In Stock</th>
          <th>Sold</th>
          <th>Owner</th>
          <th>Picture</th>
          <th>Sale price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="index">
          <td>{{ product.description }}</td>
          <td>{{ product.isInProduct ? "Yes" : "No" }}</td>
          <td>{{ product.isSold ? "Yes" : "No" }}</td>
          <td>{{ product.owner }}</td>
          <td>{{ product.picture }}</td>
          <td>${{ product.salePrice }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["products"],
};
</script>

<style scoped>
.resource-table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--clr-inkwell);
}

th {
  color: var(--clr-white);
}

th,
td {
  border: 1px solid var(--clr-inkwell);
  padding: 8px;
  text-align: left;
}

thead {
  background-color: var(--clr-inkwell);
}

th,
td:hover {
  cursor: pointer;
}
</style>
