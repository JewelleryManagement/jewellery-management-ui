<template>
  <v-container class="d-flex flex-column align-center">
    <UserDetails :id="userId" />
  </v-container>
</template>

<script setup>
import UserDetails from "./Users/UserDetails.vue";
import { computed } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const userId = computed(() => authStore.user).value.id;
</script>
