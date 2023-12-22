<template>
  <v-text-field
    v-model="formData.type"
    :counter="35"
    label="Type"
    :rules="smallFieldRules"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quantityType"
    :counter="35"
    label="Quantity Type"
    :rules="smallFieldRules"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.purity"
    :rules="numberFieldRules"
    label="Purity"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.color"
    :counter="35"
    label="Color"
    :rules="smallFieldRules"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.plating"
    :counter="35"
    label="Plating"
    :rules="smallFieldRules"
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
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();
</script>
<style scoped></style>
