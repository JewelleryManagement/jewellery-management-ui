<template>
  <v-snackbar
    v-model="internalActive"
    :color="color"
    :timeout="timeout"
    :location="location"
  >
    {{ message }}
  </v-snackbar>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    timeout: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const internalActive = ref(props.isActive);

    watch(
      () => props.isActive,
      (newIsActive) => {
        internalActive.value = newIsActive;
      }
    );

    return {
      internalActive,
    };
  },
};
</script>
