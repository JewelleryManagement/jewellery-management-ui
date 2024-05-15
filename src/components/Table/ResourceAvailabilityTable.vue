<template>
  <div class="text-center">
    <h1>{{ orgName }}'s resource table</h1>
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
    <template v-slot:item.remove="{ item }">
      <router-link
        :to="{
          name: 'Remove-Quantity',
          params: { resourceId: item.id, quantity: item.quantity },
        }"
      >
        <v-icon color="blue">mdi-minus</v-icon>
      </router-link>
    </template>

    <template v-slot:item.transfer="{ item }">
      <router-link
        :to="{
          name: 'Transfer-Quantity',
          params: { resourceId: item.id, quantity: item.quantity },
        }"
      >
        <v-icon color="#607D8B">mdi-swap-horizontal</v-icon>
      </router-link>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, toRefs } from "vue";

const props = defineProps({
  tableColumns: Array,
  resourceItem: Object,
  orgName: String,
});
const { tableColumns, resourceItem, orgName } = toRefs(props);
console.log(resourceItem);
const search = ref("");
</script>

<style scoped></style>
