<template>
  <div class="user-item" @mouseenter="showButton" @mouseleave="hideButton">
    <div class="user-details">
      <li>
        <i class="fa fa-user-circle-o user-icon"></i>
        <span class="name">{{ user.name }}</span><br>
        <span class="email">{{ user.email }}</span><br>
      </li>
    </div>
    <button v-if="showActionButton" class="user-action-button" @click="navigateAndFetchResources">Details <i class="fa fa-caret-right"></i></button>
  </div>
</template>

<script>
export default {
  props: ['user'],
  data() {
    return {
      showActionButton: false,
    };
  },
  methods: {
    showButton() {
      this.showActionButton = true;
    },
    hideButton() {
      this.showActionButton = false;
    },
    navigateAndFetchResources() {
      const userId = this.user.id;
      this.$router.push({ name: 'ResourceAvailability', params: { userId } });
    },
  },
};
</script>

<style scoped>
li {
  padding: 0.6rem;
  border-bottom: 0.06rem solid #ccc;
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
.user-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.user-action {
  display: none;
}

.user-action-button {
  display: flex;
  gap: 3px;
  align-items: center;
  background-color: transparent;
  color: #a4a3a3;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.button-text {
  margin-right: 1rem;
}

.user-action-button i {
  font-size: 2rem;
}

.user-item:hover {
  background: #eaeaea;
}

.user-item:hover .user-action {
  display: block;
}

.user-action-button:hover {
  transform: scaleY(1.05);
}
</style>
