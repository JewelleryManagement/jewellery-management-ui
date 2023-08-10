<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Products table</h1>
          </div>
          <products-table :products="products"></products-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    const showSnackbar = inject("showSnackbar");

    onMounted(async () => {
      try {
        const response = await fetchProducts();
        products.value = response;
      } catch (error) {
        showSnackbar({
          message: error.message || "Failed to fetch products.",
          color: "error",
          timeout: 4000,
          location: "top right",
        });
      }
    });

    return {
      products,
    };
  },
};
</script>

<style scoped></style>
