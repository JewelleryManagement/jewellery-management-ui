<template>
  <v-text-field
    prepend-inner-icon="mdi-account"
    label="First name"
    required
    v-model="userData.firstName"
    :rules="smallFieldRules"
    :counter="35"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-account"
    label="Last name"
    required
    v-model="userData.lastName"
    :rules="smallFieldRules"
    :counter="35"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-email-outline"
    label="Email"
    required
    v-model="userData.email"
    :rules="emailRules"
    :counter="50"
  ></v-text-field>

  <v-text-field
    v-if="!isEditPage"
    prepend-inner-icon="mdi-lock-outline"
    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
    label="Password"
    :type="isPasswordVisible ? 'text' : 'password'"
    required
    v-model="userData.password"
    @click:append-inner="isPasswordVisible = !isPasswordVisible"
    :rules="passwordRules"
  ></v-text-field>

  <v-textarea
    prepend-inner-icon="mdi-map-marker"
    label="Address"
    v-model="userData.address"
    :counter="254"
  ></v-textarea>

  <v-text-field
    prepend-inner-icon="mdi-cellphone"
    label="Phone"
    v-model="userData.phone"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-cellphone"
    label="Phone2"
    v-model="userData.phone2"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-calendar"
    label="Birth date"
    v-model="userData.birthDate"
    type="date"
  ></v-text-field>

  <v-textarea
    prepend-inner-icon="mdi-sign-text"
    rows="2"
    label="Note"
    v-model="userData.note"
    :counter="100"
  ></v-textarea>

  <v-select
    prepend-inner-icon="mdi-account-settings"
    label="Role"
    v-model="userData.role"
    :items="['USER', 'ADMIN']"
    :rules="inputRules"
    required
  >
  </v-select>
</template>

<script setup>
import {
  useTextFieldRules,
  useEmailValidationRule,
  usePasswordFieldRules,
  useInputValidate,
} from "@/utils/validation-rules";
import { ref, onMounted } from "vue";
const smallFieldRules = useTextFieldRules();
const emailRules = useEmailValidationRule();
const passwordRules = usePasswordFieldRules();
const inputRules = useInputValidate();

const isPasswordVisible = ref(false);
const { userData, isEditPage } = defineProps({
  userData: Object,
  isEditPage: Boolean,
});

onMounted(() => {
  if (!isEditPage) userData.role = "USER";
});
</script>
