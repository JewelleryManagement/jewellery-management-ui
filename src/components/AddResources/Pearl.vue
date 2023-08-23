<template>
  <v-text-field
    v-model="type"
    :counter="10"
    :rules="nameRules"
    label="Type"
    required
  ></v-text-field>

  <v-text-field
    v-model="size"
    :counter="10"
    :rules="nameRules"
    label="Size"
    required
  ></v-text-field>

  <v-text-field
    v-model="quality"
    :counter="10"
    :rules="nameRules"
    label="Quality"
    required
  ></v-text-field>

  <v-text-field
    v-model="color"
    :counter="10"
    :rules="nameRules"
    label="Color"
    required
  ></v-text-field>

  <v-text-field
    v-model="shape"
    :counter="10"
    :rules="nameRules"
    label="Shape"
    required
  ></v-text-field>
</template>

<script>
import {ref} from 'vue'
export default {

  setup() {
    const type = ref('');
    const size = ref('');
    const quality = ref('');
    const color = ref('');
    const shape = ref('');
    const counter = ref('');

    const nameRules = [
      v => !!v || `Input field is required`,
      v => (v && v.length <= 10) ? `At least 10 characters are required` : '',
    ];
    
    return {type, size, quality, color, shape, nameRules, counter};
  },
};
</script>

<style scoped></style>
