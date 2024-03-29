<template>
  <v-container class="my-12" fluid>
    <base-card>
      <products-table
        :additionalColumnsRight="disassembleAndUserColumns"
        title="Products Table"
      >
        <template v-slot:button>
          <div class="d-flex justify-end">
            <table-button path="/products/add">Create Product</table-button>
          </div>
        </template>

        <template v-slot:item.authors="{ item }">
          <user-tool-tip
            :user="author"
            v-for="(author, index) in item.authors"
            :key="item.id"
            @click.stop
          >
            <template v-if="index < item.authors.length - 1"
              >&comma;&nbsp;</template
            >
          </user-tool-tip>
        </template>

        <template v-slot:item.owner="{ item }">
          <user-tool-tip :user="item.owner" @click.stop />
        </template>

        <template v-slot:item.disassembly="{ item }">
          <disassembly-button :item="item" @click.stop />
        </template>

        <template v-slot:item.transfer="{ item }">
          <product-transfer-button :product="item" />
        </template>

        <template v-slot:item.edit="{ item }">
          <router-link
            v-if="!item.partOfSale"
            :to="`/products/edit/${item.id}`"
            @click.stop
          >
            <v-btn variant="plain">
              <v-icon color="green">mdi-pencil</v-icon>
            </v-btn>
          </router-link>
          <v-btn v-else variant="plain" disabled>
            <v-icon color="green">mdi-pencil</v-icon>
          </v-btn>
        </template>
      </products-table>
    </base-card>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onMounted, inject, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const disassembleAndUserColumns = computed(() => [
  store.state.products.tableColumnOwner,
  store.state.products.tableColumnDisassembly,
  store.state.products.tableColumnTransfer,
  store.state.products.tableColumnEdit,
]);

onMounted(async () => {
  try {
    await store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products");
  }
});
</script>
