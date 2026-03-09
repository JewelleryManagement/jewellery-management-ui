<template>
  <v-textarea
    v-model="formData.description"
    :counter="100"
    :rules="descriptionRules"
    rows="2"
    label="Description"
    required
  ></v-textarea>

  <v-text-field
    v-model="formData.quantityType"
    label="Quantity Type"
    readonly
  />

  <v-text-field
    v-model="formData.pricePerQuantity"
    :rules="numberFieldRules"
    label="Price per quantity"
    required
  ></v-text-field>

  <v-textarea
    v-model="formData.note"
    :counter="50"
    :rules="largeFieldRules"
    rows="2"
    label="Note"
    required
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import {
  useTextAreaFieldRules,
  useTextFieldLargeRules,
  useNumberFieldRules,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";
import { useRoute } from "vue-router";
import { useAllowedValuesStore } from "@/store/allowedValues.js";

const route = useRoute();
const store = useStore();
const allowedValuesStore = useAllowedValuesStore();
const formData = computed(() => store.getters["resources/getResourceDetails"]);

const setInitialValues = () => {
  if (!formData.value.quantityType) {
    setInitialResourceDetails();
  }
  setInitialAllowedValueDetails();
};

const setInitialResourceDetails = () => {
  const quantityTypeValue = quantityTypeOptions.value[0]?.value;

  if (quantityTypeValue) {
    updateResourceDetails("quantityType", quantityTypeValue);
  }
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", clazzOptions.value[0]);
  updateAllowedValueDetail("quantityType", quantityTypeOptions.value[0]);
};

const updateResourceDetails = (key, value) =>
  store.dispatch("resources/setResourceDetailsField", { key, value });

const updateAllowedValueDetail = (key, value) => {
  allowedValuesStore.setAllowedValueDetail({
    [key]: value,
  });
};

const resourceClazz = computed(() => formData.value?.clazz);

const largeFieldRules = useTextFieldLargeRules();
const descriptionRules = useTextAreaFieldRules();
const numberFieldRules = useNumberFieldRules();

const clazzOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "clazz"),
);
const quantityTypeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "quantityType"),
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(allowedValuesStore, resourceClazz);
  isFetching.value = false;

  setInitialValues();
};

const resetForm = computed(() => allowedValuesStore.allowedValuesReset);

// When fullPath changes, reinitialize allowed value details
// When resetForm changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => resetForm.value],
  () => {
    setInitialValues();
    allowedValuesStore.setAllowedValueReset(false);
  },
  { immediate: true },
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
