<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="filteredItems"
    :label="label"
    :rules="rules"
    :required="required"
    clearable
  >
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <v-list-item-action>
          <v-icon size="small" color="red" @click.stop="confirmDelete(item)">mdi-delete</v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-combobox>
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Confirm Deletion</v-card-title>
      <v-card-text>Are you sure you want to delete this value?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="handleDelete">Delete</v-btn>
        <v-btn text @click="deleteDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array,
    required: true
  },
  label: String,
  rules: Array,
  required: Boolean,
  resourceClazz: {
    type: String,
    required: true
  },
  fieldName: {
    type: String,
    required: true
  }
});

console.log("AllowedValueComboBox props:", props);
console.log("resourceClazz prop:", props.resourceClazz);
console.log("fieldName prop:", props.fieldName);

const emit = defineEmits(['update:modelValue', 'deleted']);

const store = useStore();

const filteredItems = computed(() => {
  if (
    typeof props.modelValue === 'string' &&
    props.modelValue &&
    !props.items.some(i => i.trim().toLowerCase() === props.modelValue.trim().toLowerCase())
  ) {
    return [props.modelValue, ...props.items];
  }
  return props.items;
});

const deleteDialog = ref(false);
const valueToDelete = ref('');

function confirmDelete(value) {
  console.log("value", value);
  // Extract string value from item (which might be an object from combobox)
  const stringValue = typeof value === 'object' && value !== null ? value.value || value.title || value : value;
  console.log("stringValue", stringValue);
  valueToDelete.value = stringValue;
  deleteDialog.value = true;
}

async function handleDelete() {
  console.log("handleDelete - props.resourceClazz:", props.resourceClazz);
  console.log("handleDelete - props.fieldName:", props.fieldName);
  console.log("handleDelete - valueToDelete.value:", valueToDelete.value);
  
  await store.dispatch("allowedValues/deleteAllowedValue", {
    resourceClazz: props.resourceClazz,
    fieldName: props.fieldName,
    value: valueToDelete.value,
  });
  emit('deleted', valueToDelete.value);
  deleteDialog.value = false;
}
</script> 