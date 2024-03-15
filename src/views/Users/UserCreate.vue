<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
        <UserForm :userData="userData" :isEditPage="false" />
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import UserForm from "@/components/Form/UserForm.vue";
import { useStore } from "vuex";
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapUserDataToNewData } from "@/utils/data-formatter";
const snackbarProvider = inject("snackbarProvider");

const form = ref(null);
const route = useRoute();
const router = useRouter();
const store = useStore();
const pageTitle = computed(() => route.meta.title);
const userData = ref({});

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const submitPostUser = async () => {
  const newData = mapUserDataToNewData(userData);

  try {
    const res = await store.dispatch("users/createUser", newData);
    snackbarProvider.showSuccessSnackbar(
      `Successfully created user ${res.firstName}`
    );
    router.push("/users");
  } catch (error) {
    const errors = Object.values(error?.response?.data?.error).join(', ');
    snackbarProvider.showErrorSnackbar(errors);
  }
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;

 await submitPostUser();
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>
