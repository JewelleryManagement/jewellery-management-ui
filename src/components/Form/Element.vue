<template>
  <v-textarea
    v-model="formData.description"
    :counter="100"
    :rules="descriptionRules"
    rows="2"
    label="Description"
    required
  ></v-textarea>

  <v-text-field
    v-model="formData.quantityType"
    :counter="10"
    :rules="nameRules"
    label="Quantity Type"
    required
  ></v-text-field>
</template>

<script setup>
import { useStore } from "vuex";
import {
  useTextFieldRules,
  useTextAreaFieldRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const nameRules = useTextFieldRules();
const descriptionRules = useTextAreaFieldRules();
</script>
<style scoped></style>
