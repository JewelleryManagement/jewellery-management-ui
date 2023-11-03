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
  <v-data-table :headers="tableColumns" :items="allProducts" :search="search">
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
import { ref, computed, watch, toRefs } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";

const props = defineProps({
  products: Array,
  additionalColumnsLeft: Array,
  additionalColumnsRight: Array,
});

const { products, additionalColumnsLeft, additionalColumnsRight } =
  toRefs(props);

const tableColumns = computed(() =>
  additionalColumnsLeft.value
    ? [...additionalColumnsLeft.value, ...store.getters["products/getColumns"]]
    : additionalColumnsRight.value
    ? [...store.getters["products/getColumns"], ...additionalColumnsRight.value]
    : [...store.getters["products/getColumns"]]
);

const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const store = useStore();
const search = ref("");

await store.dispatch("products/fetchProducts");
const allProducts = computed(
  () => products.value ?? store.getters["products/allProducts"]
);

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
