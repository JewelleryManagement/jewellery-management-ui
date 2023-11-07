<template>
  <v-text-field
    v-model="formData.type"
    :counter="10"
    :rules="smallFieldRules"
    label="Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.size"
    :counter="10"
    :rules="numberFieldRules"
    label="Size"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quality"
    :counter="10"
    :rules="smallFieldRules"
    label="Quality"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quantityType"
    :counter="10"
    :rules="smallFieldRules"
    label="Quantity Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.color"
    :counter="10"
    :rules="smallFieldRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.shape"
    :counter="10"
    :rules="smallFieldRules"
    label="Shape"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.pricePerQuantity"
    :rules="numberFieldRules"
    label="Price per quantity"
    required
  ></v-text-field>

  <v-textarea
    v-model="formData.note"
    :counter="100"
    :rules="largeFieldRules"
    rows="2"
    label="Note"
    required
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules()
const numberFieldRules = useNumberFieldRules();
</script>
<style scoped></style>
