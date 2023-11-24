<template>
  <v-container class="my-12" fluid>
    <base-card>
    <products-table
      :additionalColumnsRight="disassembleAndUserColumns"
      title="Products Table"
    >
      <template v-slot:button>
        <div class="d-flex justify-end">
          <v-btn
            class="mx-4"
            rounded="xs"
            :size="isSmallScreen ? 'small' : 'x-large'"
            color="red"
            to="/products/add"
          >
            Add Product
          </v-btn>
        </div>
      </template>

      <template v-slot:item.owner="{ item }">
        <user-tool-tip :user="item.owner" />
      </template>

      <template v-slot:item.disassembly="{ item }">
        <disassembly-button :item="item"></disassembly-button>
      </template>

      <template v-slot:item.transfer="{ item }">
        <product-transfer-button :product="item" />
      </template>
    </products-table>
  </base-card>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onBeforeMount, inject, computed } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify/lib/framework.mjs";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const disassembleAndUserColumns = computed(() => [
  store.state.products.tableColumnOwner,
  store.state.products.tableColumnDisassembly,
  store.state.products.tableColumnTransfer,
]);

onBeforeMount(async () => {
  try {
    await store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products");
  }
});

const isSmallScreen = computed(() => {
  return useDisplay().smAndDown.value;
});
</script>
