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
  <v-data-table :headers="tableColumns" :items="resources" :search="search">
    <template v-slot:item.delete="{ item }">
      <v-icon color="red" @click="onDelete(item.selectable.id)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.edit="{ item }">
      <router-link :to="{ name: 'Edit-Resource', params: { id: item.selectable.id } }">
      <v-icon color="green">mdi-pencil</v-icon>
      </router-link>
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

    const onDelete = async (id) => {
      const confirmation = window.confirm('Are you sure that you would like to delete this item?')
      if (confirmation) await store.dispatch("resources/removeResource", id)
    }

    return {
      search,
      tableColumns,
      resources,
      onDelete,
    };
  },
};
</script>

<style scoped></style>
