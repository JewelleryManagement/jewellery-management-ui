<template>
  <v-text-field
    prepend-inner-icon="mdi-account"
    label="First name"
    required
    v-model="userData.firstName"
    :rules="smallFieldRules"
    :counter="10"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-account"
    label="Last name"
    required
    v-model="userData.lastName"
    :rules="smallFieldRules"
    :counter="10"
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

  <v-text-field
    prepend-inner-icon="mdi-map-marker"
    label="Address"
    required
    v-model="userData.address"
    :rules="largeFieldRules"
    :counter="50"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-cellphone"
    label="Phone"
    required
    v-model="userData.phone"
    :rules="numberRules"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-cellphone"
    label="Phone2"
    required
    v-model="userData.phone2"
    :rules="numberRules"
  ></v-text-field>

  <v-text-field
    prepend-inner-icon="mdi-calendar"
    label="Birth date"
    required
    v-model="userData.birthDate"
    type="date"
  ></v-text-field>

  <v-textarea
    prepend-inner-icon="mdi-sign-text"
    rows="2"
    label="Note"
    required
    v-model="userData.note"
    :rules="textAreaRules"
    :counter="100"
  ></v-textarea>
</template>

<script setup>
import {
  useTextFieldRules,
  useEmailValidationRule,
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
  usePasswordFieldRules,
} from "@/utils/validation-rules";
import { ref } from "vue";
const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const textAreaRules = useTextAreaFieldRules();
const emailRules = useEmailValidationRule();
const numberRules = useNumberFieldRules();
const passwordRules = usePasswordFieldRules();

const isPasswordVisible = ref(false);
const { userData, isEditPage } = defineProps({
  userData: Object,
  isEditPage: Boolean,
});
</script>
