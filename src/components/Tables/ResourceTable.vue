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
    :items="resources"
    :search="search"
  ></v-data-table>
</template>
<script>
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  components: {
    VDataTable,
  },
  props: {
    resources: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      tableColumns: [
        { key: "clazz", title: "Resource Type" },
        { key: "color", title: "Color" },
        { key: "quality", title: "Quality" },
        { key: "quantityType", title: "Quantity Type" },
        { key: "shape", title: "Shape" },
        { key: "size", title: "Size" },
        { key: "type", title: "Type" },
        { key: "purity", title: "Purity" },
        { key: "plating", title: "Plating" },
        { key: "carat", title: "Carat" },
        { key: "cut", title: "Cut" },
        { key: "dimensionX", title: "dimensionX" },
        { key: "dimensionY", title: "dimensionY" },
        { key: "dimensionZ", title: "dimensionZ" },
      ],
    };
  },
};
</script>

<style scoped></style>
