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
    :items-per-page="50"
    @click:row="navigateToItemPage"
    hover
  >
    <template #item.size="{ item }">
      {{
        item.size ||
        [item.dimensionX, item.dimensionY, item.dimensionZ]
          .filter(Boolean)
          .join("x")
      }}
    </template>
    <template v-slot:item.pricePerQuantity="{ item }">
      €{{ item.pricePerQuantity?.toFixed(2) }}
    </template>

    <template v-slot:item.totalPrice="{ item }">
      €{{ (item.pricePerQuantity * item.quantity).toFixed(2) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex align-center ga-2" @click.stop>
        <IconButton
          icon="mdi-delete"
          name="Delete"
          color="red"
          @click="onDelete(item.id)"
        />

        <IconButton
          icon="mdi-pencil"
          name="Edit"
          color="green"
          :routerPath="{ name: 'Edit-Resource', params: { id: item.id } }"
        />

        <IconButton
          icon="mdi-content-duplicate"
          name="Duplicate"
          color="indigo"
          :routerPath="{ name: 'Duplicate-Resource', params: { id: item.id } }"
        />

        <IconButton
          icon="mdi-plus"
          name="Add Quantity"
          color="blue"
          :routerPath="{
            name: 'Add-Quantity',
            params: { resourceId: item.id },
          }"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import IconButton from "@/components/Button/IconButton.vue";
import { useRoute, useRouter } from "vue-router";
import { confirmDeleteResource } from "@/utils/resource-util";
import { navigateToItemDetails } from "@/utils/row-click-handler";
import { inject } from "vue";
const snackbarProvider = inject("snackbarProvider");

const route = useRoute();
const router = useRouter();
const props = defineProps({
  selectedResourceClazz: String,
  selectedFilterButton: String,
});
const internalClazzChoice = computed(() => props.selectedResourceClazz);

// When props.selectedResourceClazz changes, initialize newSortChoice for table columns
watch(
  () => props.selectedResourceClazz,
  (newSortChoice) => {
    internalClazzChoice.value = newSortChoice;
  },
);
const store = useStore();
const resources = computed(() => store.getters["resources/allResources"]);

const selectedTableColumns = computed(() => {
  if (internalClazzChoice.value === "All") {
    return store.getters["resources/getColumns"];
  }

  const getByResource = store.getters["resources/getColumnsByResource"];
  if (typeof getByResource !== "function") return [];

  const additional = props.selectedFilterButton === "All";
  return getByResource(internalClazzChoice.value, additional);
});

const filteredResources = computed(() => {
  if (internalClazzChoice.value === "All") {
    return resources.value;
  } else {
    return resources.value.filter((r) =>
      Object.keys(route.query).every(
        (key) => !(key in r) || r[key] === route.query[key],
      ),
    );
  }
});

const search = ref("");

const onDelete = async (id) => {
  confirmDeleteResource(store, id, snackbarProvider);
};

const navigateToItemPage = (row, item) => {
  const resourceId = item.internalItem.key;

  navigateToItemDetails(router, "Resource Details", "id", resourceId);
};
</script>
