<template>
  <div class="my-12">
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

      <template v-slot:item.organization="{ item }">
        <organization-tool-tip :organization="item.organization" @click.stop />
      </template>

      <template v-slot:item.disassembly="{ item }">
        <disassembly-button
          :item="item"
          @disassembled-product="updateProductList"
          @click.stop
        />
      </template>

      <template v-slot:item.transfer="{ item }">
        <product-transfer-button
          :product="item"
          @transferred-product="updateProductList"
        />
      </template>

      <template v-slot:item.edit="{ item }">
        <EditButton
          v-if="!item.partOfSale"
          :routerPath="`/products/edit/${item.id}`"
        />
        <v-btn v-else variant="plain" disabled>
          <v-icon color="green">mdi-pencil</v-icon>
        </v-btn>
      </template>
    </products-table>
  </div>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import EditButton from "@/components/Button/EditButton.vue";
import { onMounted, inject, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const disassembleAndUserColumns = computed(() => [
  store.state.products.tableColumnOwner,
  store.state.products.tableColumnOrganization,
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
const updateProductList = async (productId) => {
  await store.dispatch("products/fetchProducts");
};
</script>
