<template>
  <v-card class="elevation-12">
    <div class="text-center">
      <h1>Sales table</h1>
    </div>

    <div class="d-flex justify-end">
      <v-btn
        class="mx-4"
        rounded="xs"
        :size="isSmallScreen() ? 'small' : 'x-large'"
        color="red"
        to="/sales/add"
        >New Sale</v-btn
      >
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
      :headers="tableColumns"
      :items="sales"
      :search="search"
      @click:row="rowHandler"
      hover
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { navigateToItemDetails } from "../../utils/utils.js";
import { isSmallScreen } from "@/utils/utils";
import { VDataTable } from "vuetify/labs/VDataTable";
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const snackbarProvider = inject("snackbarProvider");
const search = ref("");
const store = useStore();
const router = useRouter();

try {
  await store.dispatch("sales/fetchSales");
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the sales!");
}
const tableColumns = computed(() => store.getters["sales/getColumns"]);
const sales = computed(() => store.getters["sales/getSales"]);

const rowHandler = (sale) => {
  navigateToItemDetails(router, sale, "sales");
};
</script>
