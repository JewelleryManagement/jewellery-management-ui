<template>
  <div class="my-12">
    <div class="text-center">
      <h1>{{ name }}</h1>
    </div>

    <div v-if="isOrganizationsPage" class="d-flex justify-end">
      <table-button path="/organizations/add">New Organization</table-button>
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
      :headers="headers"
      :items="items"
      :search="search"
      @click:row="navigateToItemPage"
      hover
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { navigateToItemDetails } from "../../utils/row-click-handler.js";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const props = defineProps({
  headers: Array,
  items: Array,
  tableTitle: String,
  name: String,
});
const route = useRoute();
const router = useRouter();

const isOrganizationsPage = computed(() => route.path === "/organizations");

const search = ref("");

const navigateToItemPage = (row, item) => {
  const organizationId = item.internalItem.key;

  navigateToItemDetails(
    router,
    "Organization Details",
    "organizationId",
    organizationId,
  );
};
</script>
