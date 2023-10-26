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
  <v-data-table :headers="tableColumnsWithRCandPC ? tableColumnsWithRCandPC : tableColumns" :items="propsProducts ? propsProducts : products" :search="search">
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

const { userId, tableColumnsWithRCandPC, propsProducts } = defineProps(["userId", "tableColumnsWithRCandPC", "propsProducts"]);

const store = useStore();
if (userId) {
  try {
    await store.dispatch("products/getProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch the user products");
  }
}

const search = ref("");
const products = computed(() => store.getters["products/allProducts"]);
console.log(products.value);
const tableColumns = userId
  ? computed(() => store.getters["products/getColumnsWithAdd"])
  : computed(() => store.getters["products/getColumns"]);

</script>

<style scoped></style>
