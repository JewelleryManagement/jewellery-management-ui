<template>
  <v-text-field
    v-model="formData.color"
    :counter="10"
    :rules="textFieldRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.carat"
    :counter="10"
    :rules="numberFieldRules"
    label="Carat"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.cut"
    :counter="10"
    :rules="textFieldRules"
    label="Cut"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.clarity"
    :counter="10"
    :rules="textFieldRules"
    label="Clarity"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionX"
    :counter="10"
    :rules="numberFieldRules"
    label="dimensionX"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionY"
    :counter="10"
    :rules="numberFieldRules"
    label="dimensionY"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionZ"
    :counter="10"
    :rules="numberFieldRules"
    label="dimensionZ"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quantityType"
    :counter="10"
    :rules="textFieldRules"
    label="Quantity Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.shape"
    :counter="10"
    :rules="textFieldRules"
    label="Shape"
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

const textFieldRules = useTextFieldRules();
const numberFieldRules = useNumberFieldRules();
</script>
<style scoped></style>
