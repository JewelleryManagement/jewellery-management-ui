<template>
  <v-card class="elevation-12">
    <div class="text-center">
      <h1>Sales table</h1>
    </div>

    <div class="d-flex justify-end">
      <v-btn
        class="mx-4"
        rounded="xs"
        :size="isSmallScreen ? 'small' : 'x-large'"
        color="red"
        to="/sales/add"
        >New Sale</v-btn
      >
    </div>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="tableColumns" :items="products" :search="search">
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { useDisplay } from "vuetify/lib/framework.mjs";
import { VDataTable } from "vuetify/labs/VDataTable";
import { ref, computed } from "vue";
const search = ref("");

const isSmallScreen = computed(() => {
  return useDisplay().smAndDown.value;
});
const tableColumns = [
  { key: "productName", title: "Product Name" },
  { key: "price", title: "Price" },
  { key: "discount", title: "Discount" },
];

const products = [
  { productName: "Product 1", price: 10, discount: 0 },
  { productName: "Product 2", price: 15, discount: 5 },
];
</script>
