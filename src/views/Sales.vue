<template>
  <base-card>
    <sales-table>
      <template v-slot:item.seller="{ item }">
        <user-tool-tip :user="item.seller" @click.stop />
      </template>

      <template v-slot:item.buyer="{ item }">
        <user-tool-tip :user="item.buyer" @click.stop />
      </template>

      <template v-slot:item.products="{ item }">
        <v-icon @click="openDialog(item.products)" @click.stop
          >mdi-cube-outline</v-icon
        >
      </template>
    </sales-table>
    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="productsDialogData"
      @close-dialog="closeDialog('products')"
    >
    </products-content-dialog>
  </base-card>
</template>

<script setup>
import { ref } from "vue";
import SalesTable from "@/components/Table/SalesTable.vue";
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const openDialog = (products) => {
  productsDialogData.value = {
    productsContent: products.map((product) => ({
      ...product,
    })),
  };
  isProductsDialogOpen.value = true;
};

const closeDialog = () => {
  isProductsDialogOpen.value = false;
};
</script>
