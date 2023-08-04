<template>
  <div class="container">
    <h1 class="products-header">Products table</h1>
    <products-table :products="products"></products-table>
  </div>
</template>

<script>
import ProductsTable from "@/components/Tables/ProductsTable.vue";
import { fetchProducts } from "@/services/HttpClientService.js";

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
      const fetchedProducts = await fetchProducts();
      this.products = fetchedProducts;
    },
  },
  mounted() {
    this.fetchResources();
  },
};
</script>

<style>
.products-header {
  background-color: var(--clr-inkwell);
  color: white;
  width: 40%;
  padding: 0.5rem;
  margin: auto;
  position: relative;
  top: 1.2rem;
  border-radius: 4px;
  z-index: -1;
}

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
}

th,
td {
  border: 0.0225rem solid var(--clr-inkwell);
  padding: 0.5rem;
  text-align: left;
  border-bottom: 0.1rem solid var(--clr-living-coral);
}

thead {
  background-color: #f2f2f2;
}

@media (max-width: 480px) {
  .products-header {
    font-size: 1rem;
    top: 0.7rem;
  }
}
</style>
