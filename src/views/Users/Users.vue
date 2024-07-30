<template>
  <v-container class="my-12" fluid>
    <base-card>
      <users-table title="Users table">
        <template v-slot:item.edit="{ item }">
          <EditButton :routerPath="`/users/edit/${item.id}`" />
        </template>
      </users-table>
    </base-card>
  </v-container>
</template>
<script setup>
import { inject, onMounted } from "vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import EditButton from "@/components/Button/EditButton.vue";
import { useStore } from "vuex";

const store = useStore();
const snackbarProvider = inject("snackbarProvider");

onMounted(async () => {
  try {
    await store.dispatch("users/fetchUsers");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch users.");
  }
});
</script>
<style></style>
