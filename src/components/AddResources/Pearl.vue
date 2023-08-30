<template>
  <v-text-field
    v-model="formData.type"
    :counter="10"
    :rules="nameRules"
    label="Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.size"
    :counter="10"
    :rules="nameRules"
    label="Size"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.quality"
    :counter="10"
    :rules="nameRules"
    label="Quality"
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
    v-model="formData.shape"
    :counter="10"
    :rules="nameRules"
    label="Shape"
    required
  ></v-text-field>
</template>

<script>
import { ref, reactive, inject, toRefs } from "vue";
import { useStore } from "vuex";

export default {
  setup(props, { emit }) {
    const store = useStore();
    const formData = store.state.resources.resourceDetails;

    const nameRules = [
      (v) => !!v || `Input field is required`,
      (v) => (v && v.length <= 10) || "Input must be less than 10 characters",
    ];

    // const submitForm = async () => {
    //   const { clazz, type, size, quality, color, shape } = toRefs(inputField);

    //   const { valid } = await form.value.validate();
    //   if (valid) {
    //     try {
    //       const dataToSubmit = {
    //         clazz: clazz.value,
    //         type: type.value,
    //         size: size.value,
    //         quality: quality.value,
    //         color: color.value,
    //         shape: shape.value,
    //       };

    //       await store.dispatch("resources/AddResources", dataToSubmit);
    //       infoSent();
    //       resData();
    //     } catch (error) {
    //       console.log(error);
    //       showSnackbar({
    //         message: "Failed to send resource.",
    //         color: "error",
    //         timeout: 4000,
    //         location: "top right",
    //       });
    //     }
    //   }
    // };

    // const resData = () => {
    //   if (form.value) {
    //     form.value.reset();
    //     form.value.resetValidation();
    //   }
    // };

    // const infoSent = () => {
    //   sentData.value = true;

    //   setTimeout(() => {
    //     sentData.value = false;
    //   }, 4000);
    // };

    return {
      formData,
      nameRules
    };
  },
};
</script>
<style scoped></style>
