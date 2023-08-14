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
    :items="products"
    :search="search"
  ></v-data-table>
</template>

<script>
import { ref } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  components: {
    VDataTable,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const search = ref("");
    const tableColumns = [
      { key: "description", text: "Description" },
      { key: "authors", text: "Authors" },
      { key: "inStock", text: "In Stock" },
      { key: "isSold", text: "Sold" },
      { key: "owner", text: "Owner" },
      { key: "picture", text: "Picture" },
      { key: "salePrice", text: "Sale price" },
    ];

    return {
      search,
      tableColumns,
    };
  },
};
</script>

<style scoped></style>
