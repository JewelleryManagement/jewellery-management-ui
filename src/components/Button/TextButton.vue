<template>
  <v-btn
    :color="color"
    :size="isMediumScreen() ? 'x-small' : 'default'"
    :to="path"
    :prepend-icon="prependIcon"
    @click.stop
    class="flex-grow-1"
  >
    {{ text }}
  </v-btn>
</template>

<script setup>
import { isMediumScreen } from "@/utils/display";

const props = defineProps({
  path: {
    type: [String, Object],
    default: undefined,
  },
  color: String,
  text: String,
  prependIcon: {
    type: String,
    default: undefined,
  },
});
</script>
