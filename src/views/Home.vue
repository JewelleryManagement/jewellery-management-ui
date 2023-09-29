<template>
  <v-container class="d-flex flex-column align-center">
    <PageViewer :pageTitle="pageTitle" :content="content" />
    <v-btn @click="clearStorageHandler" v-if="isUserAuth" maxWidth="100" class="mt-10">Logout</v-btn>

  </v-container>

</template>

<script>
import { ref } from "vue";
import PageViewer from "../components/PageViewer.vue";
import { useStore } from "vuex";

export default {
  components: {
    PageViewer,
  },
  setup() {
    const pageTitle = ref("Home Page");
    const content = ref("This is the home content");
    const store = useStore()

    const isUserAuth = store.getters['auth/isAuthenticated']

    const clearStorageHandler = () => {
      store.dispatch('auth/logout')
    }

    return {
      clearStorageHandler,
      pageTitle,
      content,
      isUserAuth
    };
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
