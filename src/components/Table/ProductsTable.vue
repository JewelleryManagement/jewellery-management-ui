<template>
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
  <v-data-table
    :headers="tableColumns"
    :items="productsInTable"
    :search="search"
  >
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");

const { products, additionalColumns } = defineProps({
  products: Array,
  additionalColumns: Array,
});

const tableColumns = computed(() =>
  additionalColumns
    ? [...additionalColumns, ...store.getters["products/getColumns"]]
    : store.getters["products/getColumns"]
);

const store = useStore();
const productsInTable = ref([]);
const fillProducts = async () => {
  if (products) {
    return products;
  } else {
    await store.dispatch("products/fetchProducts");
    return store.getters["products/allProducts"];
  }
};
productsInTable.value = await fillProducts();

const search = ref("");
</script>

<style scoped></style>
