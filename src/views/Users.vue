<template>
  <user-list :users="users" />
</template>
<script>
import PageViewer from "../components/PageViewer.vue";
import UserList from "../components/UserList.vue";

export default {
  components: {
    UserList,
    PageViewer,
  },
  data() {
    return {
    users: [
        {
            name : 'Aleksandur Dimitrov',
            email: 'aleksandurDimitrov@gmail.com',
        },
        {
            name : 'Tsvetomir Dimitrov',
            email: 'tsvetomirDimitrov@gmail.com',
        },
        {
            name : 'Aleksander Pavlov',
            email: 'aleksanderPavlov@gmail.com',
        },
        {
            name : 'Vladislav Katrankiev',
            email: 'vladislavKatrankiev@gmail.com',
        },
        {
            name : 'Peter Katrankiev',
            email: 'peterKatrankiev@gmail.com',
        },
      ],
    }
  }
};
</script>
<style>
.container {
  text-align: center;
}
</style>
