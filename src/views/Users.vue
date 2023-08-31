<template>
  <user-list />
</template>
<script>
import { inject, onMounted } from "vue";
import UserList from "@/components/UserList/UserList.vue";

import { useStore } from "vuex";

export default {
  components: {
    UserList,
  },
  setup() {
    const store = useStore();
    const showSnackbar = inject("showSnackbar");

    onMounted(async () => {
      try {
        await store.dispatch("users/fetchUsers");
      } catch (error) {
        showSnackbar({
          message: "Failed to fetch users.",
          color: "error",
          timeout: 4000,
          location: "top right",
        });
      }
    });

    return {}
  },
};
</script>
<style></style>
