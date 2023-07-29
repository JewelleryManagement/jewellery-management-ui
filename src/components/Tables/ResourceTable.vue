<template>
  <div class="table">
    <table>
      <thead>
        <table-head :columns="tableColumns" />
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
.table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
}
</style>
