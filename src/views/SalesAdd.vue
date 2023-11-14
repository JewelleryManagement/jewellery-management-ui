<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form>
        <v-select label="Seller" v-model="currentLoggedUser" disabled>
        </v-select>

        <v-autocomplete
          v-model="buyer"
          clearable
          chips
          closable-chips
          label="Buyer"
          :items="allUsersNames"
          multiple
          :rules="[validateAuthors(buyer)]"
        >
        </v-autocomplete>
        <div class="d-flex flex-column">
          <v-btn color="success" class="mt-4" block type="submit">Submit</v-btn>
          <v-btn color="error" class="mt-4" block>Reset</v-btn>
          <v-btn color="warning" class="mt-4" block @click="router.go(-1)"
            >Go Back</v-btn
          >
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { validateAuthors } from "../utils/validation-rules";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed } from "vue";
const route = useRoute();
const router = useRouter();
const saller = ref("");
const buyer = ref([]);
const store = useStore();
const pageTitle = ref(route.meta.title);

const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = allUsers.value.map((user) => user.name);

const currentLoggedUser = computed(() => store.getters["auth/getUser"]).value
  .name;
</script>
