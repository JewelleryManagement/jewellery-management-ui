<template>
  <v-container>
    <v-file-input
      label="File input"
      variant="solo-filled"
      prepend-icon="mdi-camera"
      v-model="chosenFile"
      accept=".jpeg, .jpg, .png"
      @change="emitPicture"
    ></v-file-input>
  </v-container>
</template>
<script setup>
import { ref } from "vue";
const chosenFile = ref(null);

const emit = defineEmits();
const emitPicture = () => {
  emit("picture-selected", chosenFile.value);
};
</script>
