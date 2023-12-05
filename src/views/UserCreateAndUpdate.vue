<template>
  <v-container class="my-12" fluid>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>

      <v-form @submit.prevent="handleSubmit" ref="form" class="mt-4">
        <UserForm :userData="userData" :isEditPage="isEditPage" />
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
const snackbarProvider = inject("snackbarProvider");

const form = ref(null);
const route = useRoute();
const router = useRouter();
const store = useStore();
const pageTitle = ref(route.meta.title);
const userData = ref({});
const isEditPage = route.path.includes("/edit");

if (isEditPage) {
  const userId = route.params.id;
  const userDetails = computed(() =>
    store.getters["users/getUserById"](userId)
  );
  userData.value = userDetails.value;
}

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const submitEditUser = async () => {
  const date = dateFormatter(userData.value.birthDate)
  userData.value.birthDate = date

  const data = {
    userId: route.params.id,
    data: userData.value,
  };

  try {
    await store.dispatch("users/updateUser", data);
  } catch (error) {
    console.log(error);
  }
};

const dateFormatter = (data) => {
  const date = new Date(data);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate
}

const submitPostUser = async () => {

  const date = dateFormatter(userData.value.birthDate)
  userData.value.birthDate = date

  try {
    const res = await store.dispatch("users/createUser", userData.value);
    console.log(res);
    snackbarProvider.showSuccessSnackbar(`Successfully created user ${res.firstName}`);
    router.push('/users')
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;

  if (isEditPage) {
    submitEditUser();
  } else {
    submitPostUser();
  }
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};
</script>
