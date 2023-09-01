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
    :rules="nameRules"
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
