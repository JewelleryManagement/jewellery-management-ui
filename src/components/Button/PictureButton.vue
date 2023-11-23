<template>
  <v-container>
    <v-file-input
      label="File input"
      variant="solo-filled"
      prepend-icon="mdi-camera"
      v-model="chosenFile"
      :disabled="!isDisabled"
      accept="image/*"
      @change="emitPicture"
    ></v-file-input>
  </v-container>
</template>

<script setup>
import {ref, computed} from 'vue'
const chosenFile = ref(null)
const props = defineProps({isDisabled: Boolean})
const isDisabled = computed(() => props.isDisabled)

const emit = defineEmits()
const emitPicture = () => {
    emit('picture-selected', chosenFile.value)
}
</script>

