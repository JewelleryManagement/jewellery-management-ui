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
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  data() {
    return {
      search: "",
      tableColumns: [
        { key: "description", title: "Description" },
        { key: "authors", title: "Authors" },
        { key: "inStock", title: "In Stock" },
        { key: "isSold", title: "Sold" },
        { key: "owner", title: "Owner" },
        { key: "picture", title: "Picture" },
        { key: "salePrice", title: "Sale price" },
      ],
    };
  },
  components: {
    VDataTable,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
