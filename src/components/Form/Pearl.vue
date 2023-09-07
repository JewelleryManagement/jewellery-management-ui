<template>
  <v-text-field
    v-model="formData.type"
    :counter="10"
    :rules="textFieldRules"
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
    :rules="textFieldRules"
    label="Quality"
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
    v-model="formData.color"
    :counter="10"
    :rules="textFieldRules"
    label="Color"
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

<script>
import { useStore } from "vuex";
import {
  useTextFieldRules,
  useNumberFieldRules,
} from "../../utils/validation-rules.js";

export default {
  setup() {
    const store = useStore();
    const formData = store.getters["resources/getResourceDetails"];

    const textFieldRules = useTextFieldRules()
    const numberFieldRules = useNumberFieldRules();
    
    return {
      formData,
      textFieldRules,
      numberFieldRules
    };
  },
};
</script>
<style scoped></style>
