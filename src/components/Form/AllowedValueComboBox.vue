<template>
  <v-combobox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :items="items"
    :label="label"
    :rules="rules"
    :required="true"
    :disabled="isFetched"
    clearable
  >
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #append>
          <v-icon
            size="25"
            color="red-accent-4"
            @click.stop="confirmDelete(item)"
          >
            mdi-delete
          </v-icon>
        </template>
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
import { ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  modelValue: [String, Number],
  items: {
    type: Array,
    required: true,
  },
  label: String,
  rules: Array,
  required: Boolean,
  resourceClazz: {
    type: String,
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
  },
  isFetched: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();

const deleteDialog = ref(false);
const valueToDelete = ref("");

function confirmDelete(value) {
  const stringValue =
    typeof value === "object" && value !== null
      ? value.value || value.title || value
      : value;

  valueToDelete.value = stringValue;
  deleteDialog.value = true;
}

async function handleDelete() {
  await store.dispatch("allowedValues/deleteAllowedValue", {
    resourceClazz: props.resourceClazz,
    fieldName: props.fieldName,
    value: valueToDelete.value,
  });

  deleteDialog.value = false;
}
</script>
