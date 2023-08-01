<template>
  <li>
    <i class="fa fa-user-circle-o user-icon"></i>
    <span class="name">{{ user.name }}</span><br>
    <span class="email">{{ user.email }}</span><br>
  </li>
</template>

<script>
export default {
  props: ['user'],
};
</script>

<style scoped>
li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

li:last-child {
  border-bottom: none;
}

.name {
  font-weight: bold;
}

.email {
  color: #888;
}

.user-icon {
  padding-right: 0.2rem;
}
</style>
