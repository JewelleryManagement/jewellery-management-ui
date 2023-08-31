<template>
  <v-text-field
    v-model="formData.description"
    :counter="10"
    :rules="nameRules"
    label="Description"
    required
  ></v-text-field>

</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const formData = store.state.resources.resourceDetails;

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
