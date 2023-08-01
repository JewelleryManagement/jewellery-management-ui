<template>
<<<<<<< HEAD
  <PageViewer :pageTitle="pageTitle" :content="content" />
</template>
<script>
import PageViewer from "../components/PageViewer.vue";

export default {
  components: {
    PageViewer,
  },
  data() {
    return {
      pageTitle: "Users Page",
      content: "This is the users content",
    };
  },
=======
  <user-list :users="users" />
</template>
<script>
import UserList from "@/components/UserList/UserList.vue";
import {fetchUsers} from "@/services/UserServices.js";
import { showNotification } from "@/utils/notification.js";

export default {
  components: {
    UserList,
  },
  data() {
    return {
      users: [],
    }
  },
  async created() {
    try {
      const response = await fetchUsers();
      this.users = response;
    } catch (error) {
      showNotification('Failed to fetch users: ' + error, 'error')
    }
  }
>>>>>>> origin/test
};
</script>
<style>
.container {
  text-align: center;
}
</style>
