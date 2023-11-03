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
          :to="{
            name: 'Remove-Quantity',
            params: { resourceId: item.id, userId: user.id },
          }"
        >
          <v-icon color="blue">mdi-minus</v-icon>
        </router-link>
      </template>

      <template v-slot:item.transfer="{ item }">
 
          <v-icon color="#607D8B">mdi-rotate-left</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { ref, toRefs } from "vue";

const props = defineProps({
  tableColumns: Array,
  resourceItem: Object,
  user: Object,
});
const { tableColumns, resourceItem, user } = toRefs(props);

const search = ref("");
</script>

<style scoped></style>
