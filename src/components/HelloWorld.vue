<template>
  <p>{{ msg }}</p>
</template>

<script>
export default {
  props: {
    msg: String,
  },
};
</script>

<style scoped>

p {
  font-size: 2rem;
  
}
</style>