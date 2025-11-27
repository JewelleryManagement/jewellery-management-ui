<template>
  <div class="d-flex flex-row">
    <v-combobox
      :model-value="modelValue"
      @update:model-value="onValueChange"
      :items="displayItems ? items.map((o) => o.value) : []"
      :label="label"
      :rules="rules"
      :disabled="isFetched"
      clearable
      :style="displaySku ? 'max-width: 300px' : ''"
      :class="displaySku ? 'me-4' : ''"
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

    <v-text-field
      v-if="displaySku"
      :model-value="sku"
      @update:model-value="onSkuChange"
      label="SKU"
      :rules="applySkuRules()"
      :disabled="isFetched || isSkuLocked || !props.modelValue"
      clearable
      style="max-width: 160px"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  modelValue: [String, Number],
  allowedValueDetails: {
    type: Object,
    default: () => ({ value: "", sku: "" }),
  },
  displaySku: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  displayItems: {
    type: Boolean,
    default: true,
  },
  label: String,
  rules: Array,
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

const sku = ref("");
const isSkuLocked = ref(true);

const onValueChange = (val) => {
  const found = props.items.find((item) => item.value === String(val));

  if (found) {
    sku.value = found?.sku;
    isSkuLocked.value = true;
  } else {
    sku.value = "";
    isSkuLocked.value = false;
  }

  updateModelValue(val);
  updateAllowedValueDetails(val);
};

const onSkuChange = (val) => {
  sku.value = val;
  updateAllowedValueDetails(props.modelValue);
};

const updateModelValue = (val) => {
  emit("update:modelValue", val);
};

const updateAllowedValueDetails = (val) => {
  emit("update:allowedValueDetails", {
    value: val,
    sku: sku.value,
  });
};

const emit = defineEmits(["update:modelValue", "update:allowedValueDetails"]);

watch(
  [() => props.modelValue, () => props.items],
  ([newModelValue]) => {
    if (newModelValue) {
      onValueChange(newModelValue);
    }
  },
  { immediate: true }
);

const applySkuRules = () => {
  return props.modelValue ? props.rules : [];
};

const store = useStore();

const deleteDialog = ref(false);
const valueToDelete = ref("");

function confirmDelete(value) {
  valueToDelete.value = props.items.find((v) => v.value === value.value);
  deleteDialog.value = true;
}

async function handleDelete() {
  await store.dispatch("allowedValues/deleteAllowedValue", {
    resourceClazz: props.resourceClazz,
    fieldName: props.fieldName,
    fieldValue: valueToDelete.value,
  });
  deleteDialog.value = false;
}
</script>
