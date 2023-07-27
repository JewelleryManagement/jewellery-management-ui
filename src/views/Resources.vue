<template>
  <base-card class="container">
    <h1>{{ title }}</h1>
    <base-button
      @click="setActiveTable('Resources')"
      :mode="buttonMode('Resources')"
    >
      Resources
    </base-button>
    <base-button
      @click="setActiveTable('Products')"
      :mode="buttonMode('Products')"
    >
      Products
    </base-button>

    <resource-table
      v-if="activeTable === 'Resources'"
      :resources="resources"
    ></resource-table>
    <products-table
      v-else-if="activeTable === 'Products'"
      :products="products"
    ></products-table>
  </base-card>
</template>

<script>
import ResourceTable from "../components/Resources/ResourceTable.vue";
import ProductsTable from "../components/Resources/ProductsTable.vue";
import { fetchResources, fetchProducts } from "@/services/ResourcesService.js";

export default {
  components: {
    ResourceTable,
    ProductsTable,
  },
  data() {
    return {
      title: "Resources table",
      activeTable: "Resources",
      resources: [],
      products: [],
    };
  },
  computed: {
    buttonMode() {
      return (table) => (this.activeTable === table ? "outline" : "flat");
    },
  },
  methods: {
    setActiveTable(table) {
      this.title = `${table} table`;
      this.activeTable = table;
    },
    async fetchResources() {
      try {
        const [fetchedResources, fetchedProducts] = await Promise.all([
          fetchResources(),
          fetchProducts(),
        ]);
        this.resources = fetchedResources;
        this.products = fetchedProducts;
        console.log(fetchedProducts);
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
