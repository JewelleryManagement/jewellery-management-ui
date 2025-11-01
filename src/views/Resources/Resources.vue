<template>
  <base-card>
    <v-container class="text-center text-h4 font-weight-bold">
      {{
        selectedResourceType === "All"
          ? "All resources table"
          : `${selectedResourceType}'s resources table`
      }}
    </v-container>
    <div class="d-flex justify-space-between">
      <v-menu>
        <template v-slot:activator="{ props }">
          <table-button :props="props" :variant="'outlined'"
            >Resource Type</table-button
          >
        </template>
        <v-list>
          <v-list-item
            v-for="resourceType in resourceTypes"
            :key="resourceType"
            :value="resourceType"
            @click="filterResourcesByType(resourceType)"
            >{{ resourceType }}
          </v-list-item>
        </v-list>
      </v-menu>
      <table-button path="/resources/add">Add resource</table-button>
    </div>

    <resource-table
      :selectedResourceType="selectedResourceType"
    ></resource-table>
  </base-card>
</template>

<script setup>
import { onMounted, inject, ref, computed } from "vue";
import ResourceTable from "@/components/Table/ResourceTable.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const selectedResourceType = computed(() => route.query.filter || "All");

const resourceTypes = ref([
  "All",
  "Pearl",
  "Metal",
  "Element",
  "PreciousStone",
  "SemiPreciousStone",
]);

const filterResourcesByType = (title) => {
  selectedResourceType.value = title;
  router.replace({
    query: {
      ...route.query,
      filter: title,
    },
  });
};

onMounted(async () => {
  try {
    await store.dispatch("resources/fetchResources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
  }
});
</script>

<style scoped></style>
