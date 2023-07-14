<template>
  <div class="container">
    <h1> {{ pageTitle }} </h1>
    <p> {{ content }} </p>
  </div>
</template>

<script>
export default {
  props: ["pageTitle", "content"],
};
</script>

<style scoped>
.container {
  text-align: center;
}
</style>