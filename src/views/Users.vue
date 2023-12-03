<template>
  <v-container class="my-12" fluid>
    <base-card>
      <users-table title="Users table"></users-table>
    </base-card>
  </v-container>
</template>
<script setup>
import { inject, onMounted } from "vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import { useStore } from "vuex";

const store = useStore();
const snackbarProvider = inject("snackbarProvider");

onMounted(async () => {
  try {
    await store.dispatch("users/fetchUsers");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
});
</script>
<style></style>
