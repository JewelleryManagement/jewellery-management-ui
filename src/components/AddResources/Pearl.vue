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
    label="Ready to submit this information?"
    required
  ></v-checkbox>

  <v-card-text
    v-if="sentData"
    class="text-red-darken-4 text-center text-h6 pa-0"
    style="height: 1rem;"
  >
    Information has been submited
  </v-card-text>
  <div v-else style="height: 1rem;"></div>


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
  emits: ["form-data", "reset-form-data"],
  setup(props, { emit }) {
    const sentData = ref(false);
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
      (v) => (v && v.length <= 2 ? `At least 3 characters are required` : ""),
    ];

    const submitForm = () => {
      emit("form-data", inputField);
      infoSent();
    };

    const resetValidation = () => {
      emit("reset-form-data");
    };

    

    const infoSent = () => {
      sentData.value = true;

      setTimeout(() => {
        sentData.value = false;
      }, 4000);
    };

    return {
      inputField,
      nameRules,
      submitForm,
      resetValidation,
      infoSent,
      sentData,
    };
  },
};
</script>

<style scoped></style>
