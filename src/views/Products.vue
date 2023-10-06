<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Products table</h1>
          </div>

          <div class="d-flex justify-end">
            <v-btn
              class="mx-4"
              rounded="xs"
              :size="isSmAndDown ? 'small' : 'x-large'"
              color="red"
              to="/products/add"
              >Add Product</v-btn
            >
          </div>

          <products-table></products-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onMounted, inject, computed } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify/lib/framework.mjs";

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

    return {
      isSmAndDown: computed(() => {
        return useDisplay().smAndDown.value;
      }),
    };
  },
};
</script>

<style scoped></style>
