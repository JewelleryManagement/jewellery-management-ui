<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.card {
  max-width: 37.5rem;
  margin: 1.25rem auto;
  background-color: #fff;
  padding: 1.25rem;
  border-radius: 0.3rem;
  box-shadow: 0 0.125rem 0.3rem rgba(0, 0, 0, 0.1);
}
</style>
