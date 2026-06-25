<template>
  <v-dialog v-model="dialog" width="80%">
    <v-card>
      <v-card-title>Roles</v-card-title>

      <v-card-text>
        <RolesTable :roles="roles" title="Organization Roles" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { computed } from "vue";
import RolesTable from "../Table/RolesTable.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  roles: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
