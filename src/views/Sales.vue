<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <sales-table>
          <template v-slot:item.seller="{ item }">
            <user-tool-tip :user="item.seller" />
          </template>

          <template v-slot:item.buyer="{ item }">
            <user-tool-tip :user="item.buyer" />
          </template>

          <template v-slot:item.products="{ item }">
            <v-icon @click="openDialog(item.products)">mdi-cube-outline</v-icon>
          </template>
        </sales-table>
      </v-col>
    </v-row>
    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="productsDialogData"
      @close-dialog="closeDialog('products')"
    >
    </products-content-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import SalesTable from "@/components/Table/SalesTable.vue";
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const openDialog = (item) => {
  productsDialogData.value = item[0];
  isProductsDialogOpen.value = true;
};

const closeDialog = () => {
  isProductsDialogOpen.value = false;
};
</script>
