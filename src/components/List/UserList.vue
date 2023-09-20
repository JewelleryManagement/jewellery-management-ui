<template>
  <v-card max-width="600" :class="[`mx-auto`, `my-12`, `elevation-10`]">
    <v-card-title class="text-center text-h3" >
      User List
    </v-card-title>
      <v-card-actions class="justify-end mx-10" >
        <v-btn elevation="2" rounded="xl"  @click="sortUsersHandler" color="red">
          <v-icon class="fa-spin"> {{ sortingWheel ? "mdi-cog" : "" }} </v-icon>
          Sort
        </v-btn>
      </v-card-actions>
      <v-container>
        <v-row>
          <v-col cols="12" v-if="allUsers.length > 0">
            <v-list>
              <v-list-item
                v-for="user in sortedUsers"
                :key="user.email"
                :title="user.name"
                :subtitle="user.email"
                :to="`/users/${user.id}`"
              >
                <template v-slot:prepend>
                  <v-icon size="large" class="mx-2" >
                    mdi-account-circle
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
  </v-card>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    return {
      sortedUsers: computed(() => store.getters["users/sortedUsers"]),
      allUsers: computed(() => store.getters["users/allUsers"]),
      isSorting: computed(() => store.getters["users/isSorting"]),
      sortingWheel: computed(() => store.getters["users/sortingWheel"]),
      sortedUsers: computed(() => store.getters["users/sortedUsers"]),
      sortUsersHandler: () => store.dispatch("users/toggleSorting"),
      
    };
  },
};
</script>

<style scoped>

</style>
