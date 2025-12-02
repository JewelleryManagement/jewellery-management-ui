<template>
  <div class="my-12">
    <v-container class="text-center text-h4 font-weight-bold">
      {{
        selectedResourceClazz === "All"
          ? "All resources table"
          : `${selectedButton || ""} ${selectedResourceClazz}s table`
      }}
    </v-container>
    <div class="d-flex justify-space-between">
      <div class="d-flex flex-wrap ga-2 ml-4">
        <v-btn
          v-for="resourceType in currentResourceTypes"
          :key="resourceType"
          color="red"
          rounded="xs"
          :variant="selectedButton === resourceType ? 'flat' : 'outlined'"
          @click="filterResourcesByType(resourceType)"
        >
          {{ resourceType }}
        </v-btn>
      </div>
      <table-button path="/resources/add">Add resource</table-button>
    </div>

    <resource-table
      :selectedResourceClazz="selectedResourceClazz"
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
const selectedButton = computed(() => {
  return route.query.quantityType || route.query.type;
});

const resourceTypes = ref({
  Pearl: ["Strand", "Piece"],
  Diamond: ["Natural", "Lab Grown"],
  ColoredStone: ["Piece"],
  DiamondMelee: ["Natural", "Lab Grown"],
  ColoredStoneMelee: ["Piece"],
  SemiPreciousStone: ["Strand", "Piece"],
  Metal: ["Gold", "Silver", "Platinum", "Other"],
  ClaspAndComponents: ["Pre-made", "Crafted"],
});

const currentResourceTypes = computed(() => {
  return resourceTypes.value[selectedResourceClazz.value] || [];
});

const filterResourcesByType = (title) => {
  selectedButton.value = title;
  const query = store.getters["resources/getResourceQuery"](
    selectedResourceClazz.value,
    title.replace(/\s+/g, "")
  );
  router.replace({
    query: query,
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
