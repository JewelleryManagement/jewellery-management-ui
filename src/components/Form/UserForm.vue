<template>
  <v-text-field
    label="First name"
    required
    v-model="userData.firstName"
  ></v-text-field>

  <v-text-field
    label="Last name"
    required
    v-model="userData.lastName"
  ></v-text-field>

  <v-text-field label="Email" required v-model="userData.email"></v-text-field>

  <v-text-field
    label="Address"
    required
    v-model="userData.address"
  ></v-text-field>

  <v-text-field label="Phone" required v-model="userData.phone"></v-text-field>

  <v-text-field
    label="Phone2"
    required
    v-model="userData.phone2"
  ></v-text-field>

  <v-text-field
    label="Birth date"
    required
    v-model="userData.birthDate"
  ></v-text-field>

  <v-textarea
    rows="2"
    label="Note"
    required
    v-model="userData.note"
  ></v-textarea>
</template>

<script setup>
const { userData } = defineProps({ userData: Object });
</script>
