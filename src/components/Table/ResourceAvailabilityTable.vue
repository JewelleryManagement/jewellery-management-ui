<template>
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

  <v-data-table :headers="tableColumns" :items="resourceItem" :search="search">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  tableColumns: Array,
  resources: Object,
  name: String,
});
const { tableColumns, resources: resourceItem, name } = toRefs(props);
const search = ref("");
</script>

<style scoped></style>
