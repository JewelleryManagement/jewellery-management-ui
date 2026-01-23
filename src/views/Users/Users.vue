<template>
  <div class="my-12">
    <users-table title="Users table">
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
