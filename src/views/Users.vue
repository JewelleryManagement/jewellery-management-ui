<template>
  <user-list :users="users" />
</template>
<script>
import { inject, ref, onMounted } from "vue";
import UserList from "../components/UserList/UserList.vue";
import { fetchUsers } from "@/services/HttpClientService.js";

export default {
  components: {
    UserList,
  },
  setup() {
    const users = ref([]);

    onMounted(async () => {
      const response = await fetchUsers();
      users.value = response;
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
