<template>
  <v-text-field
    v-model="formData.description"
    :counter="30"
    :rules="nameRules"
    label="Description"
    required
  ></v-text-field>

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

    return {
      formData,
      nameRules
    };
  },
};
</script>
<style scoped></style>
