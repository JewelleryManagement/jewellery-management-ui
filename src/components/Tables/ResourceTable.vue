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
  >

  <template v-slot:item.delete="{ item }">
      <v-icon>mdi-delete</v-icon>
    </template>
    <template v-slot:item.edit="{ item }">
      <v-icon>mdi-pencil</v-icon>
    </template>


  </v-data-table>
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
    const store = useStore();
    const resources = computed(() => store.getters["resources/allResources"]);
    const tableColumns = computed(() => store.getters["resources/getColumns"]);
    const search = ref("");

    return {
      search,
      tableColumns,
      resources,
    };
  },
};
</script>

<style scoped></style>
