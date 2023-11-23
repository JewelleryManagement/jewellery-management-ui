<template>
  <v-container>
    <v-file-input
      label="File input"
      variant="solo-filled"
      prepend-icon="mdi-camera"
      v-model="chosenFile"
      :disabled="!isDisabled"
    ></v-file-input>
    {{ props.selectedUser }}
  </v-container>
</template>

<script setup>
import {ref, computed} from 'vue'
const chosenFile = ref(null)
const props = defineProps({isDisabled: Boolean})
const isDisabled = computed(() => props.isDisabled)
</script>

