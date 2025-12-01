<template>
  <div class="my-12">
    <v-container class="text-center text-h4 font-weight-bold">
      {{
        selectedResourceClazz === "All"
          ? "All resources table"
          : `${selectedResourceQuantityType} ${selectedResourceClazz}s table`
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
            v-for="resourceType in currentResourceTypes"
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
      :selectedResourceClazz="selectedResourceClazz"
      :selectedResourceQuantityType="selectedResourceQuantityType"
    ></resource-table>
  </div>
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
const selectedResourceClazz = computed(() => route.query.clazz || "All");
const selectedResourceQuantityType = computed(
  () => route.query.quantityType || ""
);

const resourceTypes = ref({
  Pearl: ["Strand", "Piece"],
  Diamond: ["Natural", "LabGrown"],
  ColoredStone: ["Sapphire", "Ruby", "Emerald"],
  DiamondMelee: ["Natural", "LabGrown"],
  ColoredStoneMelee: ["Sapphire", "Ruby", "Emerald"],
  Metals: ["Gold", "Silver", "Platinum", "Other"],
  ClaspAndComponents: ["Pre-made", "Crafted"],
});

const currentResourceTypes = computed(() => {
  return resourceTypes.value[selectedResourceClazz.value] || [];
});

const filterResourcesByType = (title) => {
  selectedResourceQuantityType.value = title;
  router.replace({
    query: {
      ...route.query,
      quantityType: title,
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
