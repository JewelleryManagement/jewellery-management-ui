<template>
  <div>
    <sales-table
      :headers="tableColumns"
      :items="sales"
      tableTitle="Sales table"
    >
    </sales-table>
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { useStore } from "vuex";
import SalesTable from "@/components/Table/SalesTable.vue";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
try {
  await store.dispatch("sales/fetchSales");
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the sales!");
}
const tableColumns = computed(() => store.getters["sales/getColumns"]);
const sales = computed(() => store.getters["sales/getSales"]);
</script>
