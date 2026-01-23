<template>
  <v-tooltip :text="name" location="top">
    <template #activator="{ props: activatorProps }">
      <v-btn
        class="icon-only-btn"
        v-bind="{ ...activatorProps, ...$attrs }"
        variant="plain"
        :to="routerPath || undefined"
        :disabled="disabled"
        :ripple="false"
      >
        <v-icon
          class="action-icon"
          :color="disabled ? 'grey-lighten-1' : color"
          size="25"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script setup>
defineOptions({ inheritAttrs: false });

defineProps({
  routerPath: {
    type: [String, Object],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: String,
  icon: String,
  color: String,
});
</script>

<style scoped>
.icon-only-btn {
  min-width: unset;
  width: auto;
  height: auto;
  padding: 0;
  opacity: 1;
}

.action-icon:hover {
  transform: scale(1.3);
}
</style>
