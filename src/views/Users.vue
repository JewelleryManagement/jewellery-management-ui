<template>
  <user-list :users="users" />
</template>
<script>
import UserList from "../components/Userlist/UserList.vue";
import {getUsers} from "@/services/UserServices.js";
import axios from "@/axios.config";

export default {
  components: {
    UserList,
  },
  data() {
    return {
      users: [],
    }
  },
  methods: {
        async fetchUsers() {
            try {
                const response = await axios.get('/users');
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
  },
    async mounted() {
        await this.fetchUsers();
        console.log(this.users)
    },
};
</script>
<style>
.container {
  text-align: center;
}
</style>
