<template>
  <v-container class="my-12" fluid>
    <base-card>
      <users-table title="Users table">
        <template v-slot:item.edit="{ item }">
          <router-link :to="`/users/edit/${item.id}`" @click.stop>
            <v-icon color="green">mdi-pencil</v-icon>
          </router-link>
        </template>
      </users-table>
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
    snackbarProvider.showErrorSnackbar("Failed to fetch users.");
  }
});
</script>
<style></style>
