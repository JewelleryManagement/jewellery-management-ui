<template>
  <user-list :users="users" />
</template>
<script>
import UserList from "../components/Userlist/UserList.vue";
import {fetchUsers} from "@/services/UserServices.js";

export default {
  components: {
    UserList,
  },
  data() {
    return {
      users: [],
    }
  },
  async mounted() {
    try {
      const response = await fetchUsers();
      this.users = response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }
};
</script>
<style>
.container {
  text-align: center;
}
</style>
