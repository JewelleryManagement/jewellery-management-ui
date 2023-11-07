<template>
  <v-card max-width="600" :class="[`mx-auto`, `my-12`, `elevation-10`]">
    <v-card-title class="text-center text-h3" >
      User List
    </v-card-title>

      <v-container>
        <v-row>
          <v-col cols="12" v-if="allUsers.length > 0">
            <v-list>
              <v-list-item
                v-for="user in allUsers"
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
      allUsers: computed(() => store.getters["users/allUsers"]),
    };
  },
};
</script>

<style scoped>

</style>
