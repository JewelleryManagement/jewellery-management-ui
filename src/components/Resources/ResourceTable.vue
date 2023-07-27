<template>
  <div class="resource-table">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Color</th>
          <th>Quality</th>
          <th>Quantity Type</th>
          <th>Shape</th>
          <th>Size</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(resource, index) in resources" :key="index">
          <td>{{ resource.name }}</td>
          <td>{{ resource.color }}</td>
          <td>{{ resource.quality }}</td>
          <td>{{ resource.quantityType }}</td>
          <td>{{ resource.shape }}</td>
          <td>{{ resource.size }}</td>
          <td>{{ resource.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["resources"],
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
  border: 1px solid #ccc;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

thead {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>
