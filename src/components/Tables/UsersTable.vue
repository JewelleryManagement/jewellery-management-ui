<template>
  <v-card class="elevation-12 mt-4">
    <div class="text-center">
      <h1>{{ name }}'s resource table</h1>
      <div class="d-flex justify-end">
        <v-col cols="12" sm="6" md="4" class="text-end">
          <v-btn rounded="xs" size="x-large" color="red" to="/resources/add"
            >Add resource</v-btn
          >
        </v-col>
      </div>
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
      <template v-slot:item.delete="{ item }">
        <v-icon color="red" @click="onDelete(item.selectable.id)"
          >mdi-delete</v-icon
        >
      </template>
      <template v-slot:item.edit="{ item }">
        <router-link
          :to="{ name: 'Edit-Resource', params: { id: item.selectable.id } }"
        >
          <v-icon color="green">mdi-pencil</v-icon>
        </router-link>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  props: ["tableColumns", "resourceItem", "search", "name"],
  components: {
    VDataTable,
  },
  setup(props) {
    const onDelete = async (id) => {
      const confirmation = window.confirm(
        "Are you sure that you would like to delete this item?"
      );
    };

    return {
      tableColumns: props.tableColumns,
      resourceItem: props.resourceItem,
      search: props.search,
      name: props.name,
      onDelete,
    };
  },
};
</script>

<style scoped></style>
