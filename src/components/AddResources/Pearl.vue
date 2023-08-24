<template>
  <v-text-field
    v-model="inputField.type"
    :counter="10"
    :rules="nameRules"
    label="Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="inputField.size"
    :counter="10"
    :rules="nameRules"
    label="Size"
    required
  ></v-text-field>

  <v-text-field
    v-model="inputField.quality"
    :counter="10"
    :rules="nameRules"
    label="Quality"
    required
  ></v-text-field>

  <v-text-field
    v-model="inputField.color"
    :counter="10"
    :rules="nameRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="inputField.shape"
    :counter="10"
    :rules="nameRules"
    label="Shape"
    required
  ></v-text-field>

  <v-checkbox
    v-model="inputField.checkbox"
    :rules="[(v) => !!v || 'You must agree to continue!']"
    label="Do you agree?"
    required
  ></v-checkbox>

  <div class="d-flex flex-column">
    <v-btn color="success" class="mt-4" block @click="submitForm">
      Submit
    </v-btn>

    <v-btn color="error" class="mt-4" block @click="resetValidation">
      Reset
    </v-btn>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  emits: ["form-data"],
  setup(props, { emit }) {
    const inputField = reactive({
      clazz: "Pearl",
      type: "",
      size: "",
      quality: "",
      color: "",
      shape: "",
      counter: "",
      checkbox: false,
    });

    const nameRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 3 ? `At least 3 characters are required` : ""),
    ];

    const submitForm = () => {
      emit("form-data", inputField);
    };

    const resetValidation = () => {
      if (formRef.value) {
        formRef.value.reset();
        formRef.value.resetValidation();
      }
    };

    return { inputField, nameRules, submitForm, resetValidation };
  },
};
</script>

<style scoped></style>
