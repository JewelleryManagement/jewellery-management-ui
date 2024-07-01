<template>
  <v-card class="elevation-12">
    <div class="text-center">
      <h1>Organizations table</h1>
    </div>

    <div class="d-flex justify-end">
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
      :headers="tableColumns"
      :items="organizations"
      :search="search"
      @click:row="rowClickHandler"
      hover
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { navigateToItemDetails } from "../../utils/row-click-handler.js";
import { ref, computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const search = ref("");
const store = useStore();

try {
  await store.dispatch("organizations/fetchOrgs");
} catch (error) {
  snackbarProvider.showErrorSnackbar("Couldn't fetch the organizations!");
}

const tableColumns = computed(() => store.getters["organizations/getColumns"]);
const organizations = computed(() => store.getters["organizations/getOrgs"])

const rowClickHandler = (organization) => {
  navigateToItemDetails(router, organization, "organizations");
};

</script>
