<template>
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
};
</script>
<style>
.container {
  text-align: center;
}
</style>
