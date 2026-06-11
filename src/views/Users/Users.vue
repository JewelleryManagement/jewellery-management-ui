<template>
  <div class="my-12">
    <users-table title="Users table" headBtnName="Create user">
      <template v-slot:item.actions="{ item }">
        <IconButton
          icon="mdi-pencil"
          name="Edit"
          color="green"
          :routerPath="`/users/edit/${item.id}`"
          @click.stop
        />
      </template>
    </users-table>
  </div>
</template>
<script setup>
import { inject, onMounted } from "vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import IconButton from "@/components/Button/IconButton.vue";
import { useUsersStore } from "@/store/users";

const userStore = useUsersStore();
const snackbarProvider = inject("snackbarProvider");

onMounted(async () => {
  try {
    await userStore.fetchUsers();
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch users.");
  }
});
</script>
<style></style>
