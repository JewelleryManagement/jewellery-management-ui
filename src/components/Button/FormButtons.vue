<template>
  <div class="d-flex flex-column">
    <v-btn color="success" class="mt-4" block type="submit"> Submit </v-btn>
    <v-btn color="error" class="mt-4" block @click="resetForm">Reset</v-btn>
    <v-btn color="warning" class="mt-4" block @click="router.go(-1)"
      >Go Back</v-btn
    >
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const emits = defineEmits(["reset-form"]);

const resetForm = () => {
  emits("reset-form");
};
</script>
