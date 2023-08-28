<template>
  <v-form ref="form">
    <v-text-field
      v-model="inputField.type"
      :counter="10"
      :rules="nameRules"
      label="Type"
      required
    ></v-text-field>

    <v-text-field
      v-model="inputField.purity"
      :counter="10"
      :rules="nameRules"
      label="Purity"
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
      v-model="inputField.plating"
      :counter="10"
      :rules="nameRules"
      label="Plating"
      required
    ></v-text-field>

    <v-checkbox
      v-model="inputField.checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Ready to submit this information?"
      required
      :style="{ color: inputField.checkbox ? 'green' : 'red' }"
    ></v-checkbox>

    <v-card-text
      v-if="sentData"
      class="text-red-darken-4 text-center text-h6 pa-0"
      style="height: 1rem"
    >
      Information has been submited
    </v-card-text>
    <div v-else style="height: 1rem"></div>

    <div class="d-flex flex-column">
      <v-btn color="success" class="mt-4" block @click="submitForm">
        Submit
      </v-btn>

      <v-btn color="error" class="mt-4" block @click="resData"> Reset </v-btn>
    </div>
  </v-form>
</template>

<script>
import { ref, reactive, inject, toRefs } from "vue";
import { useStore } from "vuex";

export default {
  setup(props, { emit }) {
    const showSnackbar = inject("showSnackbar");

    const store = useStore();
    const form = ref(null);

    const sentData = ref(false);
    const inputField = reactive({
      clazz: "PreciousMetal",
      type: "",
      purity: "",
      color: "",
      plating: "",
      counter: "",
      checkbox: false,
    });

    const nameRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 10) || "Input must be less than 10 characters",
    ];

    const submitForm = async () => {
      const { clazz, type, purity, color, plating } = toRefs(inputField);

      const { valid } = await form.value.validate();
      if (valid) {
        try {
          const dataToSubmit = {
            clazz: clazz.value,
            type: type.value,
            purity: purity.value,
            color: color.value,
            plating: plating.value,
          };

          // await store.dispatch("resources/AddResources", dataToSubmit);
          infoSent();
          resData();
        } catch (error) {
          console.log(error);
          showSnackbar({
            message: "Failed to send resource.",
            color: "error",
            timeout: 4000,
            location: "top right",
          });
        }
      }
    };

    const resData = () => {
      if (form.value) {
        form.value.reset();
        form.value.resetValidation();
      }
    };

    const infoSent = () => {
      sentData.value = true;

      setTimeout(() => {
        sentData.value = false;
      }, 4000);
    };

    return {
      form,
      resData,
      inputField,
      nameRules,
      submitForm,
      infoSent,
      sentData,
    };
  },
};
</script>
<style scoped></style>
