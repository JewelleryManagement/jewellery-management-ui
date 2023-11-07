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
    :rules="smallInputRules"
    label="Quantity Type"
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
    :counter="50"
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
  useTextAreaFieldRules,
  useTextFieldLargeRules,
  useNumberFieldRules
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const smallInputRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules()
const descriptionRules = useTextAreaFieldRules();
const numberFieldRules = useNumberFieldRules();

</script>
<style scoped></style>
