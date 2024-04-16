<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-text-field
          v-model="orgObject.name"
          :counter="35"
          label="Name"
          :rules="useTextFieldRules()"
          required
        ></v-text-field>

        <v-text-field
          v-model="orgObject.address"
          :counter="35"
          label="Address"
          :rules="useTextFieldRules()"
          required
        ></v-text-field>

        <v-textarea
          v-model="orgObject.note"
          :counter="100"
          :rules="useTextFieldLargeRules()"
          rows="2"
          label="Note"
          required
        ></v-textarea>
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import {
  useTextFieldRules,
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";
import { ref, reactive, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const [route, router] = [useRoute(), useRouter()];
const pageTitle = ref(route.meta.title);
const form = ref(null);
const orgObject = reactive({
  name: "",
  address: "",
  note: "",
});

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
  }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const postOrg = async (data) => {
  try {
    await store.dispatch("organizations/postOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully sold the product!");
    router.push("/organizations");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;
  await postOrg(orgObject)
};
</script>   
