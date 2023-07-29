<template>
  <div>
    <table>
      <thead>
        <table-head :columns="tableColumns" />
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
table {
  margin-top: 1rem;
  width: 100%;
  border-collapse: collapse;
  overflow-x: auto;
}
</style>
