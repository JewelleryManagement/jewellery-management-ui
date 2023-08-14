<template>
  <PageViewer :pageTitle="pageTitle" :content="content" />
</template>

<script>
import { ref } from "vue";
import PageViewer from "../components/PageViewer.vue";

export default {
  components: {
    PageViewer,
  },
  setup() {
    const pageTitle = ref("Home Page");
    const content = ref("This is the home content");

    return {
      pageTitle,
      content,
    };
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
