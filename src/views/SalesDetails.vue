<template>
  <v-container fluid>
    <sale-card :current-sale="currentSale" />

    <products-table
      :products="saleProducts"
      :additionalColumnsRight="ownerColumn"
      title="Products in the current sale"
    >
      <template v-slot:item.owner="{ item }">
        <user-tool-tip :user="item.owner" />
      </template>
    </products-table>
  </v-container>
</template>

<script setup>
import { formatProducts } from "../utils/utils.js";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import SaleCard from "@/components/Card/SaleCard.vue";
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
const ownerColumn = computed(() => [store.state.products.tableColumnOwner]);
</script>

<style lang="scss" scoped></style>
