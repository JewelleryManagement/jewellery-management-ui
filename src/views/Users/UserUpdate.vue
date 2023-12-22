<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
        <UserForm :userData="userData" :isEditPage="true" />
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
import {
  mapUserDataToNewData,
  formatDateForInput,
} from "@/utils/data-formatter";
const snackbarProvider = inject("snackbarProvider");

const form = ref(null);
const route = useRoute();
const router = useRouter();
const store = useStore();
const pageTitle = computed(() => route.meta.title);
const userId = computed(() => route.params.id);
const userDetails = computed(() => store.getters["users/getUserById"](userId.value));
const userData = ref({});

const { birthDate, ...otherUserDetails } = userDetails.value;
const formattedDate = formatDateForInput(birthDate);

userData.value = {
  ...otherUserDetails,
  birthDate: formattedDate,
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const submitEditUser = async () => {
  const newData = mapUserDataToNewData(userData);

  const data = {
    userId: route.params.id,
    data: newData,
  };

  try {
    const res = await store.dispatch("users/updateUser", data);
    snackbarProvider.showSuccessSnackbar(
      `Successfully created user ${res.firstName}`
    );
  } catch (error) {
    const errors = Object.values(error?.response?.data?.error).join(", ");
    snackbarProvider.showErrorSnackbar(errors);
  }
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;

  submitEditUser();
  router.push("/users");
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>
