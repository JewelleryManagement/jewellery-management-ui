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
    :items="filteredResources"
    :search="search"
  >
    <template v-slot:item.delete="{ item }">
      <v-icon color="red" @click="onDelete(item.id)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.edit="{ item }">
      <router-link :to="{ name: 'Edit-Resource', params: { id: item.id } }">
        <v-icon color="green">mdi-pencil</v-icon>
      </router-link>
    </template>
    <template v-slot:item.add="{ item }">
      <router-link :to="{ name: 'Add-Quantity', params: { id: item.id } }">
        <v-icon color="blue">mdi-plus</v-icon>
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
import { ref, computed, watch } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";

export default {
  props: ["selectedResourceType"],
  components: {
    VDataTable,
  },
  setup(props) {
    const internalSortChoice = ref(props.selectedResourceType);
    watch(
      () => props.selectedResourceType,
      (newSortChoice) => {
        internalSortChoice.value = newSortChoice;
      }
    );
    const store = useStore();
    const resources = computed(() => store.getters["resources/allResources"]);

    const columnGettersMap = {
      All: "resources/getColumns",
      LinkingPart: "resources/getColumnsForLinkingPart",
      Pearl: "resources/getColumnsForPearl",
      Gemstone: "resources/getColumnsForGemstone",
      PreciousMetal: "resources/getColumnsForPreciousMetal",
    };

    const selectedTableColumns = computed(() => {
      const getterName = columnGettersMap[internalSortChoice.value];
      return store.getters[getterName ? getterName : "resources/getColumns"];
    });

    const filteredResources = computed(() => {
      if (internalSortChoice.value === "All") {
        return resources.value;
      } else {
        return resources.value.filter(
          (x) => x.clazz === internalSortChoice.value
        );
      }
    });

    const search = ref("");

    const onDelete = async (id) => {
      const confirmation = window.confirm(
        "Are you sure that you would like to delete this item?"
      );
      if (confirmation) await store.dispatch("resources/removeResource", id);
    };

    return {
      filteredResources,
      internalSortChoice,
      search,
      tableColumns: selectedTableColumns,
      resources,
      onDelete,
    };
  },
};
</script>

<style scoped></style>
