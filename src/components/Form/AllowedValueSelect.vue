<template>
  <v-select
    :model-value="modelValue"
    @update:model-value="onValueChange"
    :items="storedAllowedValues.map((stored) => stored.value)"
    :label="label"
    :rules="rules"
    clearable
  />
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: [String, Number],
  allowedValueDetails: {
    type: Object,
  },
  storedAllowedValues: {
    type: Array,
  },
  label: String,
  rules: Array,
});

const emit = defineEmits(["update:modelValue", "update:allowedValueDetails"]);

const sku = ref("");

const onValueChange = (val) => {
  const found = props.storedAllowedValues.find(
    (item) => item.value === String(val)
  );

  sku.value = found?.sku ?? "";

  updateModelValue(val);
  updateAllowedValueDetails(val);
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

// Reinitialize allowed value state whenever modelValue or isFetching change.
// This handles cases like form resets or loading existing data (edit mode),
// ensuring modelValue and related SKU fields stay in sync.
watch(
  [() => props.modelValue, () => props.isFetching],
  ([newModelValue]) => {
    if (newModelValue) {
      onValueChange(newModelValue);
    } else sku.value = "";
  },
  { immediate: true }
);
</script>
