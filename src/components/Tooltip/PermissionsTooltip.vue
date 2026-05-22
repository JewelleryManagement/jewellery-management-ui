<template>
  <v-tooltip location="top">
    <template #activator="{ props: tooltipProps }">
      <span
        v-bind="tooltipProps"
        class="d-inline-block text-truncate"
        style="max-width: 140px; cursor: pointer"
      >
        {{ formattedPermissionsShort }}
      </span>
    </template>

    <div style="max-width: 320px; white-space: normal; overflow-wrap: anywhere">
      {{ formattedPermissions }}
    </div>
  </v-tooltip>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  permissions: {
    type: Array,
    default: () => [],
  },
});

const formattedPermissions = computed(() => props.permissions.join(", "));

const formattedPermissionsShort = computed(() => {
  const text = formattedPermissions.value;
  if (text.length <= 20) return text;
  return `${text.slice(0, 20)}...`;
});
</script>
