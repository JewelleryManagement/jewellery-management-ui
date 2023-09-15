<template>
  <v-card class="elevation-12 mt-4">
    <div class="text-center">
      <h1>{{ name }}'s resource table</h1>
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

    <v-data-table
      :headers="tableColumns"
      :items="resourceItem"
      :search="search"
    >
    </v-data-table>
  </v-card>
</template>

<script>
import { VDataTable } from "vuetify/labs/VDataTable";
import { useRoute } from "vue-router";

export default {
  props: ["tableColumns", "resourceItem", "search", "name"],
  components: {
    VDataTable,
  },
  setup(props) {
    const route = useRoute();

    return {
      tableColumns: props.tableColumns,
      resourceItem: props.resourceItem,
      search: props.search,
      name: props.name,
      pageId: route.params.id
    };
  },
};
</script>

<style scoped></style>
