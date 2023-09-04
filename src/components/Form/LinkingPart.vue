<template>
  <v-textarea
    v-model="formData.description"
    :counter="100"
    :rules="descriptionRules"
    rows=2
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

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const formData = store.getters["resources/getResourceDetails"];

    const nameRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 30) || "Input must be less than 30 characters",
    ];

    const descriptionRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 100) || "Input must be less than 100 characters",
    ];

    return {
      formData,
      nameRules,
      descriptionRules
    };
  },
};
</script>
<style scoped></style>
