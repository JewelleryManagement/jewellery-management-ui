<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div class="user-list">
    <h1>User List</h1>
    <button class="sort-btn" @click="sortUsers">
        <div class="sort-sign">
            <i class="fa fa-cog" :class="{ spinning: isSorting }"></i>
        </div>
        <div class="sort-text">Sort</div>
    </button>
    <ul id="users" v-if="users.length > 0">
      <li v-for="user in sortedUsers" :key="user.email">
        <i class="fa fa-user-circle-o user-icon"></i>
        <span class="name">{{ user.name }}</span><br>
        <span class="email">{{ user.email }}</span><br>
      </li>
    </ul>
    <p v-else>No users found.</p>
  </div>
</template>

<script>
export default {
  props: ['users'],
  data() {
    return {
      isSorting: false,
      isAscending: true
    };
  },
  computed: {
    sortedUsers() {
      return this.users.slice().sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (this.isAscending) {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
        }

        return 0;
      });
    }
  },
  methods: {
    sortUsers() {
      this.isSorting = true;

      setTimeout(() => {
        this.isAscending = !this.isAscending;
        this.isSorting = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

.user-list {
  max-width: 600px;
  margin: 20px auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

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

.username {
  color: #555;
}

.no-users {
    text-align: center;
    color: #333;
    font-size: 24px;
    position: relative;
    padding: 3rem;
    top: 1rem;
}


.sort-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: .3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-color: var(--clr-living-coral);
}


.sort-sign {
  width: 100%;
  transition-duration: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-sign i {
  font-size: 17px;
  color: white;
}

.sort-text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: .3s;
}

.sort-btn:hover {
  width: 125px;
  border-radius: 40px;
  transition-duration: .3s;
}

.sort-btn:hover .sort-sign {
  width: 30%;
  transition-duration: .3s;
  padding-left: 0.5rem;
}

.sort-btn:hover .sort-text {
  opacity: 1;
  width: 70%;
  transition-duration: .3s;
  padding-right: 10px;
}

.sort-btn:active {
  transform: translate(2px ,2px);
}

.user-icon {
    padding-right:0.2rem
}

.fa-cog.spinning {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
