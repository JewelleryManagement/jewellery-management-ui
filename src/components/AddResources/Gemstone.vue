<template>
  <v-text-field
    v-model="formData.color"
    :counter="10"
    :rules="nameRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.carat"
    :counter="10"
    :rules="nameRules"
    label="Carat"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.cut"
    :counter="10"
    :rules="nameRules"
    label="Cut"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.clarity"
    :counter="10"
    :rules="nameRules"
    label="Clarity"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionX"
    :counter="10"
    :rules="nameRules"
    label="dimensionX"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionY"
    :counter="10"
    :rules="nameRules"
    label="dimensionY"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionZ"
    :counter="10"
    :rules="nameRules"
    label="dimensionZ"
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
    v-model="formData.shape"
    :counter="10"
    :rules="nameRules"
    label="Shape"
    required
  ></v-text-field>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const formData = store.getters["resources/getResourceDetails"];

    const nameRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 10) || "Input must be less than 10 characters",
    ];

    return {
      formData,
      nameRules
    };
  },
};
</script>
<style scoped></style>
