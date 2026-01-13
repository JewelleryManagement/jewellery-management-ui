<template>
  <v-text-field
    v-model="formData.quantityType"
    label="Quantity Type"
    readonly
  />

  <AllowedValueSelect
    v-model="formData.type"
    v-model:allowed-value-details="allowedValueDetail.type"
    :stored-allowed-values="typeOptions"
    label="Type"
    :rules="useInputValidate()"
  />

  <AllowedValueComboBox
    v-model="formData.shape"
    v-model:allowed-value-details="allowedValueDetail.shape"
    label="Shape"
    :storedAllowedValues="shapeOptions"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="shape"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.size"
    v-model:allowed-value-details="allowedValueDetail.size"
    :storedAllowedValues="sizeOptions"
    label="Size"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="size"
    :is-fetching="isFetching"
  />

  <v-text-field
    v-model="formData.carat"
    :rules="numberFieldRules"
    label="Carat"
    required
  ></v-text-field>

  <AllowedValueComboBox
    v-model="formData.color"
    v-model:allowed-value-details="allowedValueDetail.color"
    :storedAllowedValues="colorOptions"
    label="Color"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="color"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.clarity"
    v-model:allowed-value-details="allowedValueDetail.clarity"
    :storedAllowedValues="clarityOptions"
    label="Clarity"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="clarity"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.cut"
    v-model:allowed-value-details="allowedValueDetail.cut"
    :storedAllowedValues="cutOptions"
    label="Cut"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="cut"
    :is-fetching="isFetching"
  />

  <v-text-field
    v-model="formData.pricePerQuantity"
    :rules="numberFieldRules"
    label="Price Per Unit"
    required
  ></v-text-field>

  <v-textarea
    v-model="formData.note"
    :counter="100"
    :rules="largeFieldRules"
    rows="2"
    label="Note"
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import AllowedValueSelect from "./AllowedValueSelect.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
  useInputValidate,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";
import { useRoute } from "vue-router";
import { setInitialType } from "./ResourceUtil";

const route = useRoute();
const store = useStore();
const formData = computed(() => store.getters["resources/getResourceDetails"]);
const allowedValueDetail = computed(
  () => store.getters["allowedValues/getAllowedValueDetails"]
);

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
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz);

const clazzOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "clazz")
);
const quantityTypeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "quantityType")
);
const typeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "type")
);
const shapeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shape")
);
const sizeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "size")
);
const colorOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "color")
);
const clarityOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "clarity")
);
const cutOptions = computed(() => getAllowedValue(store, resourceClazz, "cut"));

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz);
  isFetching.value = false;

  setInitialValues();
  setInitialType(resourceClazz.value, store, route);
};

const resetForm = computed(
  () => store.getters["allowedValues/getAllowedValueReset"]
);

// When fullPath changes, reinitialize allowed value details and quantityType
// When resetForm changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => resetForm.value],
  () => {
    setInitialValues();
    store.dispatch("allowedValues/setAllowedValueReset", false);
  },
  { immediate: true }
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
