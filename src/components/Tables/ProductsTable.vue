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
import { ref, computed } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";

export default {
  components: {
    VDataTable,
  },
  setup() {
    const search = ref("");
    const store = useStore();
    const products = computed(() => store.getters["products/allProducts"]);
    const tableColumns = computed(() => store.getters["products/getColumns"]);

    return {
      search,
      tableColumns,
      products,
    };
  },
};
</script>

<style scoped></style>
