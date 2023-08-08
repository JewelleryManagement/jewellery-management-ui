<template>
  <user-list :users="users" />
</template>
<script>
import { inject, ref, onMounted } from "vue";
import { fetchUsers } from "@/services/HttpClientService.js";
import UserList from "@/components/UserList/UserList.vue";
export default {
  components: {
    UserList,
  },
  setup() {
    const users = ref([]);
    const showSnackbar = inject('showSnackbar');

    onMounted(async () => {
      try {
        const response = await fetchUsers();
        users.value = response;
      } catch (error) {
        showSnackbar({
          message: error.message || "Failed to fetch users.",
          color: 'error',
          timeout: 4000,
          location: "top right"
        });
      }
    });

    return {
      users,
    };
  },
};
</script>
<style>
.container {
  text-align: center;
}
</style>
