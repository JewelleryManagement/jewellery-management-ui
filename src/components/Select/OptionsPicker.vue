<template>
  <v-sheet width="300" class="mx-auto">
    <div>
      <v-checkbox
        v-for="option in allOptions"
        :key="option"
        v-model="internalChosenOptions"
        :label="option"
        :value="option"
      ></v-checkbox>
    </div>
  </v-sheet>
</template>
  
<script setup>
import { computed } from "vue";

const props = defineProps({
  allOptions: {
    type: Array,
    required: true,
  },
  chosenOptions: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["update:chosenOptions"]);
const internalChosenOptions = computed({
  get: () => props.chosenOptions,
  set: (value) => emit("update:chosenOptions", value),
});
</script>
  
<style lang="scss" scoped></style>
  