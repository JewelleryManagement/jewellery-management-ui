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
import { ref, watch } from "vue";

const props = defineProps({
  allOptions: {
    type: Array,
    required: true,
  },
  chosenOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:chosenOptions"]);

const internalChosenOptions = ref([...props.chosenOptions]);

watch(internalChosenOptions, (newOptions) => {
  emit("update:chosenOptions", newOptions);
});
</script>
  
<style lang="scss" scoped></style>
  