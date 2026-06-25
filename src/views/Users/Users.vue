<template>
  <div class="my-12">
    <users-table title="Users table" :headBtnName="buttonName">
      <template v-slot:item.actions="{ item }">
        <IconButton
          v-if="permissionsStore.canUpdateSystemUsers"
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
import { computed, inject, onMounted } from "vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import IconButton from "@/components/Button/IconButton.vue";
import { useUsersStore } from "@/store/users";
import { usePermissionsStore } from "@/store/permissions";

const userStore = useUsersStore();
const permissionsStore = usePermissionsStore();
const snackbarProvider = inject("snackbarProvider");
const buttonName = computed(() =>
  permissionsStore.canCreateSystemUsers ? "Create User" : undefined,
);

onMounted(async () => {
  try {
    await permissionsStore.fetchCurrentUserSystemPermissions();

    if (permissionsStore.canReadSystemUsers) {
      await userStore.fetchUsers();
    } else {
      userStore.clearUsers();
    }
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch users.");
  }
});
</script>
<style></style>
