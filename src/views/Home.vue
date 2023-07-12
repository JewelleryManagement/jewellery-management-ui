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
        pageTitle: "Home Page",
          content: "This is the home content",
    };
  },

}
</script>

<style scoped>
.container {
  text-align: center;  

}
</style>