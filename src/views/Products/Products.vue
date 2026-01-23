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

      <template v-slot:item.owner="{ item }">
        <user-tool-tip :user="item.owner" @click.stop />
      </template>

      <template v-slot:item.organization="{ item }">
        <organization-tool-tip :organization="item.organization" @click.stop />
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <disassembly-button
            :item="item"
            @disassembled-product="updateProductList"
          />

          <product-transfer-button
            :product="item"
            @transferred-product="updateProductList"
          />

          <IconButton
            icon="mdi-pencil"
            name="Edit"
            color="green"
            :disabled="item.partOfSale"
            :routerPath="`/products/edit/${item.id}`"
          />
        </div>
      </template>
    </products-table>
  </div>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import IconButton from "@/components/Button/IconButton.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue";
import ProductTransferButton from "@/components/Button/ProductTransferButton.vue";
import OrganizationToolTip from "@/components/Tooltip/OrganizationToolTip.vue";
import UserToolTip from "@/components/Tooltip/UserToolTip.vue";
import TableButton from "@/components/Button/TableButton.vue";
import { onMounted, inject, computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");

const disassembleAndUserColumns = computed(
  () => store.getters["products/getDisassembleAndUserColumns"],
);

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
