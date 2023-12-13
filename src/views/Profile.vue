<template>
  <v-container class="d-flex flex-column align-center">
      <UserDetails :id="userId" />
  </v-container>
</template>

<script setup>
import UserDetails from "./Users/UserDetails.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userId = computed(() => store.getters["auth/getUser"]).value.id;

</script>
