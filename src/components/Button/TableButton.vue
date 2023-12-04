<template>
  <v-btn
    :variant="variant ? variant : 'elevated'"
    class="mx-4"
    rounded="xs"
    :size="isSmallScreen() ? 'small' : 'x-large'"
    color="red"
    :to="path"
    v-bind="props ? props : ''"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup>
import { isSmallScreen } from "@/utils/display";
const { props, variant, path } = defineProps({
  props: Object,
  variant: String,
  path: String,
});
</script>
