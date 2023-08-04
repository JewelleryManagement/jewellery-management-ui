<template>
  <div class="table">
    <table class="table-table">
      <thead>
        <table-head :columns="tableColumns" />
      </thead>
      <tbody>
        <template v-if="resources.length === 0">
          <tr class="no-resources">
            <td :colspan="tableColumns.length" style="text-align: center">
              No resources found
            </td>
          </tr>
        </template>
        <template v-else>
          <table-row
            v-for="(resource, index) in resources"
            :key="index"
            :data="resource"
            :columns="tableColumns"
          />
        </template>
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
        { key: "clazz", label: "Resource Type" },
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
  overflow-y: auto;
  height: 45rem;
  border-radius: 8px;
}

.table-table {
  overflow: auto;
  height: 45rem;
  z-index: 0;
}

.no-resources {
  font-size: 3rem;
  background-color: var(--clr-inkwell);
  color: var(--clr-living-coral);
  text-align: center;
}

.table::-webkit-scrollbar {
  width: 6px;
}

.table::-webkit-scrollbar-thumb {
  background-color: var(--clr-living-coral);
}

.table::-webkit-scrollbar-thumb:hover {
  background-color: var(--clr-living-coral-hover);
}

.table::-webkit-scrollbar-track {
  background-color: var(--clr-inkwell);
}

@media (max-width: 768px) {
  .table {
    height: auto;
  }
  .table-table {
    height: auto;
  }
}

@media (max-width: 480px) {
  .table {
    height: 40rem;
    margin-top: 0.5rem;
  }
  .table-table {
    height: 40rem;
  }
  .no-resources {
    font-size: 2rem;
  }
}
</style>
