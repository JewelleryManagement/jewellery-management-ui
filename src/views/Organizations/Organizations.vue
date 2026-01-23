<template>
  <organizations-table
    :headers="tableColumns"
    :items="organizations"
    name="Organizations Table"
  >
  </organizations-table>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
const store = useStore();

try {
  await store.dispatch("organizations/fetchOrgs");
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the organizations!");
}

const tableColumns = computed(() => store.getters["organizations/getColumns"]);
const organizations = computed(() => store.getters["organizations/getOrgs"]);
</script>
