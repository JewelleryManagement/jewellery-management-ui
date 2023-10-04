<template>
  <v-card
    class="d-flex my-14 mx-auto"
    elevation="8"
    rounded="lg"
    max-width="1000"
  >
    <v-container
      class="pa-4 pa-md-12 d-flex flex-column d-sm-none d-md-flex"
      style="background: linear-gradient(to right, #e57373, #ffebee)"
    >
      <v-card-text
        class="text-h3 text-center text-light-blue-lighten-5 font-weight-bold"
      >
        Welcome Back!
      </v-card-text>
      <v-img
        class="my-4 my-md-16 mx-auto"
        min-width="300"
        src="../assets/team.png"
      ></v-img>
    </v-container>

    <v-container class="mt-12 pa-4 pa-md-12 ml-sm-10 mr-sm-10">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="emailInput"
        :rules="useEmailFieldRules()"
      ></v-text-field>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="passwordInput"
        :rules="usePasswordFieldRules()"
      ></v-text-field>

      <v-btn
        block
        class="mt-12 mb-4 mb-md-8"
        color="#E57373"
        size="large"
        variant="tonal"
        @click="submitHandler"
      >
        Log In
      </v-btn>
    </v-container>
  </v-card>
</template>
<script setup>
import {useEmailFieldRules, usePasswordFieldRules} from '../utils/validation-rules'
import { useStore } from "vuex";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
const snackbarProvider = inject("snackbarProvider");

const store = useStore();
const router = useRouter();
const visible = ref(false);
const emailInput = ref("");
const passwordInput = ref("");

const submitHandler = async () => {
  if (emailInput.value && passwordInput.value) {
    const data = {
      email: emailInput.value,
      password: passwordInput.value,
    };
    userLogin(data);
  } 
};

const userLogin = async (data) => {
  try {
    const user = await store.dispatch("auth/login", data);
    snackbarProvider.showSuccessSnackbar("Successfully logged in!");
    user ? router.push("/home") : "";
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error.message);
  }
};
</script>

<style scoped></style>
