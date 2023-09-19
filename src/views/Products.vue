<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Products table</h1>
          </div>
          <products-table></products-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onMounted, inject } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    ProductsTable,
  },
  setup() {
    const store = useStore();
    const snackbarProvider = inject("snackbarProvider");

    onMounted(async () => {
      try {
        await store.dispatch("products/fetchProducts");
      } catch (error) {
        snackbarProvider.showErrorSnackbar("Failed to fetch products");
      }
    });

    return {};
  },
};
</script>

<style scoped></style>
