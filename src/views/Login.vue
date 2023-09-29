<template>
  <v-card
    class="d-flex my-14 mx-auto"
    elevation="8"
    rounded="lg"
    max-width="1000"
  >
    <v-container
      class="pa-4 pa-md-12 d-flex flex-column d-sm-none d-md-flex"
      style="background: linear-gradient(to right, #284563, #89c7fa)"
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

    <v-container class="pa-4 pa-md-12 ml-sm-10 mr-sm-10">
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card class="mb-4 mb-md-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn
        block
        class="mb-4 mb-md-8"
        color="blue"
        size="large"
        variant="tonal"
      >
        Log In
      </v-btn>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
</script>

<style scoped></style>
