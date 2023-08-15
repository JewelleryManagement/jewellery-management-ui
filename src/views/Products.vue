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
import ProductsTable from "@/components/Tables/ProductsTable.vue";
import { onMounted, inject } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    ProductsTable,
  },
  setup() {
    const store = useStore();
    const showSnackbar = inject("showSnackbar");

    onMounted(async () => {
      try {
        store.dispatch("products/fetchProducts");
      } catch (error) {
        showSnackbar({
          message: error.message || "Failed to fetch products.",
          color: "error",
          timeout: 4000,
          location: "top right",
        });
      }
    });

    return {};
  },
};
</script>

<style scoped></style>
