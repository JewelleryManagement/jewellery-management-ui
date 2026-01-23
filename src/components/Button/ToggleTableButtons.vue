<template>
  <div id="scroll-to"></div>
  <div class="my-12 d-flex flex-wrap justify-center">
    <v-btn
      v-for="button in buttons"
      :key="button.label"
      :prepend-icon="button.icon"
      :class="isMediumAndDownScreen() ? 'mx-2 my-2' : 'mx-15'"
      :size="isMediumAndDownScreen() ? 'small' : 'x-large'"
      color="red"
      rounded="xs"
      :variant="modelValue === button.label ? 'flat' : 'outlined'"
      @click="onButtonClick(button.label)"
    >
      {{ getButtonLabel(button.label) }}
    </v-btn>
  </div>
</template>

<script setup>
import { isMediumAndDownScreen } from "@/utils/display";
import { useGoTo } from "vuetify";
import { nextTick } from "vue";

const emit = defineEmits(["update:modelValue"]);

const goTo = useGoTo();

const props = defineProps({
  buttons: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const getButtonLabel = (label) => {
  return label + (!isMediumAndDownScreen() ? " Table" : "");
};

const onButtonClick = async (label) => {
  const newButtonValue = props.modelValue === label ? null : label;
  emit("update:modelValue", newButtonValue);

  await nextTick();

  goTo("#scroll-to", { duration: 500, offset: -60 });
};
</script>
