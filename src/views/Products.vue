<template>
  <base-card class="container">
    <h1>Products table</h1>
    <products-table :products="products"></products-table>
  </base-card>
</template>

<script>
import ProductsTable from "../components/Tables/ProductsTable.vue";
import { fetchProducts } from "@/services/ResourcesService.js";

export default {
  components: {
    ProductsTable,
  },
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async fetchResources() {
      try {
        const fetchedProducts = await fetchProducts();
        this.products = fetchedProducts;
      } catch (error) {
        console.log("Failed to fetch resources!", error);
      }
    },
  },
  mounted() {
    this.fetchResources();
  },
};
</script>

<style>
.container {
  text-align: center;
}

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
