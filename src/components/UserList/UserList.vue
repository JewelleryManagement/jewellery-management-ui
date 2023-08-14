<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <v-card max-width="600" :class="[`mx-auto`, `my-12`, `elevation-10`]">
    <v-card-title>
      <h1>User List</h1>
      <v-card-actions>
        <v-btn class="sort-btn" @click="sortUsers">
          <div class="sort-sign">
            <v-icon class="fa-spin">
              {{ isSorting ? "mdi-cog" : "" }}
            </v-icon>
          </div>
          <div class="sort-text">Sort</div>
        </v-btn>
      </v-card-actions>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" v-if="sortedUsers.length > 0">
            <v-list lines="tree">
              <v-list-item
                v-for="user in sortedUsers"
                :key="user.email"
                :title="user.name"
                :subtitle="user.email"
              >
                <template v-slot:prepend>
                  <v-icon>
                    <i class="fa fa-user-circle-o user-icon"></i>
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" v-else>
            <p class="no-users">No users found.</p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: ["users"],
  setup(props) {
    const isSorting = ref(false);
    const isAscending = ref(true);

    const sortedUsers = computed(() => {
      return props.users.slice().sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (isAscending.value) {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
        }

        return 0;
      });
    });

    const sortUsers = () => {
      isSorting.value = true;

      setTimeout(() => {
        isAscending.value = !isAscending.value;
        isSorting.value = false;
      }, 1000);
    };

    return {
      isSorting,
      sortedUsers,
      sortUsers,
    };
  },
};
</script>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
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
  font-size: 1.5rem;
  position: relative;
  padding: 3rem;
  top: 1rem;
}

.sort-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 2.81rem;
  height: 2.81rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  box-shadow: 0.125rem 0.125rem 0.6rem rgba(0, 0, 0, 0.199);
  background-color: var(--clr-living-coral);
}

.sort-sign {
  width: 100%;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-sign i {
  font-size: 1.0625rem;
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
  transition-duration: 0.3s;
}

.sort-btn:hover {
  width: 7.8125rem;
  border-radius: 2.5rem;
  transition-duration: 0.3s;
}

.sort-btn:hover .sort-sign {
  width: 30%;
  transition-duration: 0.3s;
  padding-left: 0.5rem;
}

.sort-btn:hover .sort-text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.3s;
  padding-right: 0.625rem;
}

.sort-btn:active {
  transform: translate(0.125rem, 0.125rem);
}

.user-icon {
  padding-right: 0.2rem;
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

.user-items {
  list-style: none;
  padding: 0;
}

.user-item {
  padding: 0.625rem;
  border-bottom: 0.0625rem solid #ccc;
}
</style>
