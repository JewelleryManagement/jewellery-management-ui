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
    :headers="selectedTableColumns"
    :items="filteredResources"
    :search="search"
  >
    <template v-slot:item.delete="{ item }">
      <v-icon color="red" @click="onDelete(item.id)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.edit="{ item }">
      <EditButton
        :routerPath="{ name: 'Edit-Resource', params: { id: item.id } }"
      />
    </template>
    <template v-slot:item.duplicate="{ item }">
      <router-link
        :to="{ name: 'Duplicate-Resource', params: { id: item.id } }"
      >
        <v-icon color="indigo"> mdi-content-duplicate </v-icon>
      </router-link>
    </template>
    <template v-slot:item.add="{ item }">
      <router-link
        :to="{ name: 'Add-Quantity', params: { resourceId: item.id } }"
      >
        <v-icon color="blue">mdi-plus</v-icon>
      </router-link>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import EditButton from "@/components/Button/EditButton.vue";

const props = defineProps({
  selectedResourceClazz: String,
  selectedResourceQuantityType: String,
});
const internalClazzChoice = computed(() => props.selectedResourceClazz);
const internalQuantityTypeChoice = computed(
  () => props.selectedResourceQuantityType
);

watch(
  () => props.selectedResourceClazz,
  (newSortChoice) => {
    internalClazzChoice.value = newSortChoice;
  }
);
const store = useStore();
const resources = computed(() => store.getters["resources/allResources"]);

const columnGettersMap = {
  All: "resources/getColumns",
  Element: "resources/getColumnsForElement",
  Pearl: "resources/getColumnsForPearl",
  Metal: "resources/getColumnsForMetal",
  PreciousStone: "resources/getColumnsForPreciousStone",
  SemiPreciousStone: "resources/getColumnsForSemiPreciousStone",
};

const selectedTableColumns = computed(() => {
  const getterName = columnGettersMap[internalClazzChoice.value];
  return store.getters[getterName ? getterName : "resources/getColumns"];
});

const filteredResources = computed(() => {
  if (internalClazzChoice.value === "All") {
    return resources.value;
  } else {
    return resources.value.filter(
      (x) =>
        x.clazz === internalClazzChoice.value &&
        x.quantityType === internalQuantityTypeChoice.value
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
</script>

<style scoped></style>
