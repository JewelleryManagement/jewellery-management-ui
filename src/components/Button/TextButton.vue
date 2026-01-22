<template>
  <v-btn
    :color="color"
    :size="isMediumScreen() ? 'x-small' : 'default'"
    :to="path || undefined"
    @click.stop
    class="flex-grow-1"
    >{{ text }}</v-btn
  >
</template>

<script setup>
import { isMediumScreen } from "@/utils/display";
const props = defineProps({
  path: {
    type: [String, Object],
    default: null,
  },
  color: String,
  text: String,
});
</script>
