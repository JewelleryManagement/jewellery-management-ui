<template>
  <v-container fluid>
    <v-card class="mx-auto mt-10 text-center elevation-2" max-width="600">
      <div class="d-flex flex-sm-row flex-column justify-space-around mt-4">
        <div>
          <strong>Seller</strong>
          <div>Name: {{ currentSale.seller.name }}</div>
          <div>Email: {{ currentSale.seller.email }}</div>
        </div>
        <div>
          <strong>Buyer</strong>
          <div>Name: {{ currentSale.buyer.name }}</div>
          <div>Email: {{ currentSale.buyer.email }}</div>
        </div>
      </div>

      <br />

      <div>
        <strong>Sale Details</strong>
        <div>Total Price: {{ currentSale.totalPrice }}</div>
        <div>Discount: {{ currentSale.totalDiscountedPrice }}</div>
        <div>Total Discount: {{ currentSale.totalDiscount }}</div>
      </div>

      <br />

      <div>Sale made on: {{ currentSale.date }}</div>

      <br />
    </v-card>

    <v-row justify="center" class="mt-10">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Products in the current Sale</h1>
          </div>
          <products-table
            :products="saleProducts"
            :additionalColumnsRight="disassembleAndUserColumns"
          >
            <template v-slot:item.owner="{ item }">
              <user-tool-tip :user="item.owner" />
            </template>
          </products-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { formatProducts } from "../utils/utils.js";

import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const route = useRoute();
const saleId = route.params.saleId;

const currentSale = computed(() => store.getters["sales/getSaleById"](saleId));
const saleProducts = currentSale.value.products.map((product) =>
  formatProducts(product)
);
const disassembleAndUserColumns = computed(() => [
  store.state.products.tableColumnOwner,
]);
</script>

<style lang="scss" scoped></style>
