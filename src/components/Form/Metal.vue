<template>
  <v-text-field
    v-model="formData.type"
    :counter="10"
    :rules="nameRules"
    label="Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quantityType"
    :counter="10"
    :rules="nameRules"
    label="Quantity Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.purity"
    :counter="10"
    :rules="numberFieldRules"
    label="Purity"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.color"
    :counter="10"
    :rules="nameRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.plating"
    :counter="10"
    :rules="nameRules"
    label="Plating"
    required
  ></v-text-field>
</template>

<script setup>
import { useStore } from "vuex";
import {
  useTextFieldRules,
  useNumberFieldRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const nameRules = useTextFieldRules();
const numberFieldRules = useNumberFieldRules();
</script>
<style scoped></style>
