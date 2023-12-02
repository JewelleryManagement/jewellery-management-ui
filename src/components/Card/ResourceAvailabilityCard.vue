<template>
  <v-container>
    <v-card class="mx-auto text-center" width="600">
      <v-card-title>
        <v-icon color="pink">mdi-diamond</v-icon>
        {{ resource.clazz }}
        <v-icon color="pink">mdi-diamond</v-icon>
      </v-card-title>

      <v-card-subtitle v-for="item in usersAndQuantities" :key="item.id">
        User: {{ item.owner.firstName }} - Quantity: {{ item.quantity }}
      </v-card-subtitle>

      <v-card-text>
        <div v-html="formattedResource"></div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useStore } from "vuex";

const { resourceAvailability } = defineProps({
  resourceAvailability: Object,
});

const formatResource = (jsonObj) => {
  const store = useStore();
  const allTable = store.getters["resources/getTableColumns"];
  let output = "";

  for (const column of allTable) {
    const key = column.key;
    const title = column.title;

    if (jsonObj.hasOwnProperty(key)) {
      output += `<p>${title}: ${jsonObj[key]}</p>`;
    }
  }

  return output;
};

const resource = resourceAvailability.resource;
const formattedResource = formatResource(resourceAvailability.resource);
const usersAndQuantities = resourceAvailability.usersAndQuantities;
</script>


<style scoped></style>
