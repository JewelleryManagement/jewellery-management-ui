<template>
  <v-card class="elevation-12 mt-4">
    <div class="text-center">
      <h1>{{ user.name }}'s resource table</h1>
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
      <template v-slot:item.remove="{ item }">
        <router-link
          :to="{ name: 'Remove-Quantity', params: { id: item.selectable.id } }"
        >
          <v-icon color="blue">mdi-minus</v-icon>
        </router-link>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  props: ["tableColumns", "resourceItem", "search", "user"],
  components: {
    VDataTable,
  },
  setup(props) {
    return {
      tableColumns: props.tableColumns,
      resourceItem: props.resourceItem,
      search: props.search,
      user: props.user,
    };
  },
};
</script>

<style scoped></style>
