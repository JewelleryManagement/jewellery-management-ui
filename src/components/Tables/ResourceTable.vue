<template>
  <div class="resource-table">
    <table>
      <thead>
        <tr>
          <table-head
            v-for="column in tableColumns"
            :key="column.key"
            :columns="column"
          />
        </tr>
      </thead>
      <tbody>
        <table-row
          v-for="(resource, index) in resources"
          :key="index"
          :data="resource"
          :columns="tableColumns"
        />
      </tbody>
    </table>
  </div>
</template>
<script>
import TableRow from "./TableRow.vue";
import TableHead from "./TableHead.vue";
export default {
  components: {
    TableRow,
    TableHead,
  },
  props: {
    resources: {
      type: Array,
      required: true,
    },
  },
  computed: {
    tableColumns() {
      return [
        { key: "name", label: "Name" },
        { key: "color", label: "Color" },
        { key: "quality", label: "Quality" },
        { key: "quantityType", label: "Quantity Type" },
        { key: "shape", label: "Shape" },
        { key: "size", label: "Size" },
        { key: "type", label: "Type" },
        { key: "purity", label: "Purity" },
        { key: "plating", label: "Plating" },
        { key: "carat", label: "Carat" },
        { key: "cut", label: "Cut" },
        { key: "dimensionX", label: "dimensionX" },
        { key: "dimensionY", label: "dimensionY" },
        { key: "dimensionZ", label: "dimensionZ" },
      ];
    },
  },
};
</script>

<style scoped>
.resource-table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
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
