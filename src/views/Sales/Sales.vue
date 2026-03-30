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
import SalesTable from "@/components/Table/SalesTable.vue";
import { useSalesStore } from "@/store/sales";

const snackbarProvider = inject("snackbarProvider");
const salesStore = useSalesStore();
try {
  await salesStore.fetchSales();
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the sales!");
}
const tableColumns = computed(() => salesStore.tableColumns);
const sales = computed(() => salesStore.sales);
</script>
