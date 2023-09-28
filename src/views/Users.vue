<template>
  <v-container class="my-12" fluid>
    <user-list />
  </v-container>
</template>
<script>
import { inject, onMounted } from "vue";
import UserList from "@/components/List/UserList.vue";

import { useStore } from "vuex";

export default {
  components: {
    UserList,
  },
  setup() {
    const store = useStore();
    const snackbarProvider = inject("snackbarProvider");

    onMounted(async () => {
      try {
        await store.dispatch("users/fetchUsers");
        await store.dispatch("resources/fetchResources");
      } catch (error) {
        snackbarProvider.showErrorSnackbar("Failed to fetch users.");
      }
    });

    return {};
  },
};
</script>
<style></style>
