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
    <template v-slot:item.resourceContent="{ item }">
      <v-icon @click="openDialog(item, 'resources')">mdi-cube</v-icon>
    </template>

    <template v-slot:item.productsContent="{ item }">
      <v-icon @click="openDialog(item, 'products')">mdi-cube-outline</v-icon>
    </template>

    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-data-table>

  <resource-content-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :data="resourceDialogData"
    @close-dialog="closeDialog('resources')"
  ></resource-content-dialog>

  <products-content-dialog
    v-if="isProductsDialogOpen"
    v-model="isProductsDialogOpen"
    :data="productsDialogData"
    @close-dialog="closeDialog('products')"
  >
  </products-content-dialog>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");

const { products, additionalColumnsLeft, additionalColumnsRight } = defineProps(
  {
    products: Array,
    additionalColumnsLeft: Array,
    additionalColumnsRight: Array,
  }
);

const tableColumns = computed(() =>
  additionalColumnsLeft
    ? [...additionalColumnsLeft, ...store.getters["products/getColumns"]]
    : additionalColumnsRight
    ? [...store.getters["products/getColumns"], ...additionalColumnsRight]
    : [...store.getters["products/getColumns"]]
);

const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const store = useStore();
const search = ref("");
const productsInTable = ref([]);
const fillProducts = async () => {
  if (products) {
    return products;
  } else {
    try {
      await store.dispatch("products/fetchProducts");
    } catch (error) {
      snackbarProvider.showErrorSnackbar("Failed to fetch products");
    }
    return store.getters["products/allProducts"];
  }
};
productsInTable.value = await fillProducts();


const openDialog = (item, content) => {
  if (content == "resources") {
    resourceDialogData.value = item;
    isResourceDialogOpen.value = true;
  } else {
    productsDialogData.value = item;
    isProductsDialogOpen.value = true;
  }
};

const closeDialog = (content) => {
  if (content === "resources") {
    isResourceDialogOpen.value = false;
  } else {
    isProductsDialogOpen.value = false;
  }
};
</script>

<style scoped></style>
