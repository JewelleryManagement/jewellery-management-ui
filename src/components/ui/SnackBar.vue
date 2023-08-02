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
export default {
  data() {
    return {
      internalActive: this.isActive,
    };
  },

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
  beforeUpdate() {
    this.internalActive = this.isActive;
  },

  methods: {
    showSnackbar(payload) {
      this.isActive = true;
      this.message = payload.message;
      this.color = payload.color;
      this.timeout = payload.timeout;
      this.location = "bottom left";
    },
  },
};
</script>
