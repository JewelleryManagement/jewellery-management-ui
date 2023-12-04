<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
        <UserForm :userData="userData" />
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import UserForm from "@/components/Form/UserForm.vue";
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
const form = ref(null);
const route = useRoute();
const store = useStore();
const pageTitle = ref(route.meta.title);
const userData = ref({});

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const handleSubmit = () => {
  console.log(userData.value);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>
