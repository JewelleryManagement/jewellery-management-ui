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
        { clazz: "name", label: "Name" },
        { clazz: "color", label: "Color" },
        { clazz: "quality", label: "Quality" },
        { clazz: "quantityType", label: "Quantity Type" },
        { clazz: "shape", label: "Shape" },
        { clazz: "size", label: "Size" },
        { clazz: "type", label: "Type" },
        { clazz: "purity", label: "Purity" },
        { clazz: "plating", label: "Plating" },
        { clazz: "carat", label: "Carat" },
        { clazz: "cut", label: "Cut" },
        { clazz: "dimensionX", label: "dimensionX" },
        { clazz: "dimensionY", label: "dimensionY" },
        { clazz: "dimensionZ", label: "dimensionZ" },
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
