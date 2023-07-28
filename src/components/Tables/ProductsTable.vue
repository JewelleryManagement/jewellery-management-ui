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
          v-for="(product, index) in products"
          :key="index"
          :data="product"
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
    products: {
      type: Array,
      required: true,
    },
  },
  computed: {
    tableColumns() {
      return [
        { key: "description", label: "Description" },
        { key: "inStock", label: "In Stock" },
        { key: "isSold", label: "Sold" },
        { key: "owner", label: "Owner" },
        { key: "picture", label: "Picture" },
        { key: "salePrice", label: "Sale price" },
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
  cursor: pointer;
}
</style>
