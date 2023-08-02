<template>
  <user-list :users="users" />
</template>
<script>
import UserList from "@/components/UserList/UserList.vue";
import { fetchUsers } from "@/services/HttpClientService.js";
import { showNotification } from "@/utils/notification.js";

export default {
  components: {
    UserList,
  },
  data() {
    return {
      users: [],
    };
  },
  async created() {
    try {
      const response = await fetchUsers();
      this.users = response;
    } catch (error) {
      showNotification("Failed to fetch users: " + error, "error");
    }
  },
};
</script>
<style>
.container {
  text-align: center;
}
</style>
