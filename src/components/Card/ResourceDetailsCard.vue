<template>
  <v-container>
    <v-card class="mx-auto text-center" width="600" elevation="6">
      <v-card-title>
        <v-icon color="pink">mdi-diamond</v-icon>
        {{ resource.clazz }}
        <v-icon color="pink">mdi-diamond</v-icon>
      </v-card-title>

      <v-card-text>
        <div v-html="formattedResource"></div>
      </v-card-text>

      <div
        v-if="isDetailsPage"
        class="pa-4 d-flex flex-wrap justify-space-between ga-3"
      >
        <text-button color="red" text="Delete" @click="onDelete()" />

        <text-button
          color="green"
          text="Edit"
          :path="{ name: 'Edit-Resource', params: { id: resource.id } }"
        />

        <text-button
          color="indigo"
          text="Duplicate"
          :path="{ name: 'Duplicate-Resource', params: { id: resource.id } }"
        />

        <text-button
          color="blue"
          text="Add Quantity"
          :path="{ name: 'Add-Quantity', params: { resourceId: resource.id } }"
        />
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import TextButton from "../Button/TextButton.vue";
import { confirmDeleteResource } from "@/utils/resource-util";
import { getQuery } from "@/utils/resource-util";
import { inject } from "vue";
const snackbarProvider = inject("snackbarProvider");

const { resourceAvailability } = defineProps({
  resourceAvailability: Object,
});

const store = useStore();
const route = useRoute();
const router = useRouter();

const isDetailsPage = computed(() => route.path.startsWith("/resources"));

const formatResource = (jsonObj) => {
  const allTable = store.getters["resources/getTableColumns"];
  let output = "";

  for (const column of allTable) {
    const { key, title } = column;

    if (jsonObj.hasOwnProperty(key)) {
      let value = jsonObj[key];

      if (key === "pricePerQuantity") {
        value = `€${Number(value).toFixed(2)}`;
      }

      output += `<p>${title}: ${value}</p>`;
    }
  }

  return output;
};

const resource = resourceAvailability.resource;
const formattedResource = formatResource(resourceAvailability.resource);

const onDelete = async () => {
  const deleteConfirmation = await confirmDeleteResource(
    store,
    resource.id,
    snackbarProvider,
  );
  if (!deleteConfirmation) return;

  const query = getQuery(resource, store);
  router.push({ path: "/resources", query: query });
};
</script>

<style scoped></style>
