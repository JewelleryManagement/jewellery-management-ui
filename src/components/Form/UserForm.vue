<template>
  <v-text-field
    label="First name"
    required
    v-model="userData.firstName"
    :rules="smallFieldRules"
    :counter="10"
  ></v-text-field>

  <v-text-field
    label="Last name"
    required
    v-model="userData.lastName"
    :rules="smallFieldRules"
    :counter="10"
  ></v-text-field>

  <v-text-field
    label="Email"
    required
    v-model="userData.email"
    :rules="emailRules"
    :counter="50"
  ></v-text-field>

  <v-text-field
    label="Address"
    required
    v-model="userData.address"
    :rules="largeFieldRules"
    :counter="50"
  ></v-text-field>

  <v-text-field
    label="Phone"
    required
    v-model="userData.phone"
    :rules="numberRules"
  ></v-text-field>

  <v-text-field
    label="Phone2"
    required
    v-model="userData.phone2"
    :rules="numberRules"
  ></v-text-field>

  <v-text-field
    label="Birth date"
    required
    v-model="userData.birthDate"
    type="date"
    
  ></v-text-field>

  <v-textarea
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
  useTextAreaFieldRules
} from "@/utils/validation-rules";
const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const textAreaRules = useTextAreaFieldRules()
const emailRules = useEmailValidationRule();
const numberRules = useNumberFieldRules();

const { userData } = defineProps({ userData: Object });
</script>
