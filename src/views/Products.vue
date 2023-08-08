<template>
  <base-card class="container">
    <h1>Products table</h1>
    <products-table :products="products"></products-table>
  </base-card>
</template>

<script>
import ProductsTable from "@/components/Tables/ProductsTable.vue";
import { fetchProducts } from "@/services/HttpClientService.js";
import { ref, onMounted, inject } from "vue";

export default {
  components: {
    ProductsTable,
  },
  setup() {
    const products = ref([]);
    const showSnackbar = inject('showSnackbar');

    onMounted(async () => {
      try {
        const response = await fetchProducts();
        products.value = response;
      } catch (error) {
        showSnackbar({
          message: error.message || "Failed to fetch products.",
          color: 'error',
          timeout: 4000,
          location: "top right"
        });
      }
    });

    return {
      products,
    };
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
  border: 0.0625rem solid #ccc;
}

th,
td {
  border: 0.0625rem solid #ccc;
  padding: 0.5rem;
  text-align: left;
}

thead {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}
</style>
