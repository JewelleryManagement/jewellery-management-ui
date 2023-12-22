<template>
  <v-btn
    :variant="computedVariant"
    class="mx-4"
    rounded="xs"
    :size="buttonSize"
    color="red"
    :to="path"
    v-bind="additionalProps"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue';
import { isSmallScreen } from "@/utils/display";
const { props, variant, path } = defineProps({
  props: Object,
  variant: String,
  path: String,
});

const additionalProps = computed(() => props || {});
const buttonSize = computed(() => isSmallScreen() ? 'small' : 'x-large');
const computedVariant = computed(() => variant || 'elevated');
</script>