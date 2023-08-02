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
      const response = await fetchUsers();
      this.users = response;
  },
};
</script>
<style>
.container {
  text-align: center;
}
</style>
