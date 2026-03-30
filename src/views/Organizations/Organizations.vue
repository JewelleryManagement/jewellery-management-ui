<template>
  <organizations-table
    :headers="tableColumns"
    :items="organizations"
    name="Organizations Table"
  >
  </organizations-table>
</template>

<script setup>
import { computed, inject } from "vue";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
import { useOrganizationsStore } from "@/store/organizations";
const organizationsStore = useOrganizationsStore();
const snackbarProvider = inject("snackbarProvider");

try {
  await organizationsStore.fetchOrganizations();
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the organizations!");
}

const tableColumns = computed(() => organizationsStore.tableColumns);
const organizations = computed(() => organizationsStore.organizations);
</script>
