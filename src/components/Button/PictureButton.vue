<template>
  <v-container>
    <v-file-input
      label="File input"
      variant="solo-filled"
      prepend-icon="mdi-camera"
      v-model="chosenFile"
      accept="image/png, image/jpg, image/jpeg"
      @change="emitPicture"
    ></v-file-input>
  </v-container>
</template>
<!-- png, jpg, jpeg -->
<script setup>
import {ref} from 'vue'
const chosenFile = ref(null)
const props = defineProps({isDisabled: Boolean})

const emit = defineEmits()
const emitPicture = () => {
    emit('picture-selected', chosenFile.value)
}
</script>

