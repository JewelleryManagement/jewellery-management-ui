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
          <v-btn
            variant="outlined"
            class="mx-4"
            rounded="xs"
            :size="isSmallScreen() ? 'small' : 'x-large'"
            color="red"
            v-bind="props"
          >
            Resource Type
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="resourceType in resourceTypes"
            :key="resourceType"
            :value="resourceType"
          >
            <v-list-item-title @click="filterResourcesByType(resourceType)">{{
              resourceType
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        class="mx-4"
        rounded="xs"
        :size="isSmallScreen() ? 'small' : 'x-large'"
        color="red"
        to="/resources/add"
        >Add resource</v-btn
      >
    </div>

    <resource-table
      :selectedResourceType="selectedResourceType"
    ></resource-table>
  </base-card>
</template>

<script setup>
import { onMounted, inject, ref } from "vue";
import ResourceTable from "@/components/Table/ResourceTable.vue";
import { useStore } from "vuex";
import { isSmallScreen } from "@/utils/display";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const selectedResourceType = ref("All");

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
};

onMounted(async () => {
  try {
    await store.dispatch("resources/fetchResources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
});
</script>

<style scoped></style>
