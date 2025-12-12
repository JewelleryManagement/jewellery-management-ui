<template>
  <div>{{ formattedPermissionsShort }}</div>
  <v-tooltip activator="parent" location="top">
    <div>{{ formattedPermissions }}</div>
  </v-tooltip>
</template>

<script setup>
import {ref, watch } from "vue";

const props = defineProps({ permissions: Array });
const formattedPermissions = ref(props.permissions?.join(", "));
const formattedPermissionsShort = ref(
  formattedPermissions.value?.substring(0, 10) + "..."
);
watch(
  () => props.permissions,
  (permissions) => {
    formattedPermissions.value = permissions.join(", ");
    formattedPermissionsShort.value = formattedPermissions.value.substring(0, 10) + "...";
  }
);
</script>