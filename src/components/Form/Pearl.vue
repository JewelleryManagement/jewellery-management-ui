<template>
  <AllowedValueSelect
    v-model="formData.quantityType"
    v-model:allowed-value-details="allowedValueDetail.quantityType"
    :stored-allowed-values="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallFieldRules"
  />

  <AllowedValueComboBox
    v-model="formData.type"
    v-model:allowed-value-details="allowedValueDetail.type"
    :storedAllowedValues="typeOptions"
    label="Type"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="type"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.quality"
    v-model:allowed-value-details="allowedValueDetail.quality"
    :storedAllowedValues="qualityOptions"
    label="Quality"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="quality"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.shape"
    v-model:allowed-value-details="allowedValueDetail.shape"
    :storedAllowedValues="shapeOptions"
    label="Shape"
    :required="true"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="shape"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.shapeSpecification"
    v-model:allowed-value-details="allowedValueDetail.shapeSpecification"
    :storedAllowedValues="shapeSpecificationOptions"
    label="Shape Specification"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="shapeSpecification"
    :is-fetching="isFetching"
  />

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
    v-model="formData.colorHue"
    v-model:allowed-value-details="allowedValueDetail.colorHue"
    :storedAllowedValues="colorHueOptions"
    label="Color Hue"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="colorHue"
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
    v-model="formData.pricePerQuantity"
    :rules="numberFieldRules"
    label="Price per quantity"
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
import { setInitialType } from "../../utils/resource-util";
import { useRoute } from "vue-router";
import { useAllowedValuesStore } from "@/store/allowedValues";
import { useResourcesStore } from "@/store/resources";

const route = useRoute();
const allowedValuesStore = useAllowedValuesStore();
const resourcesStore = useResourcesStore();
const formData = computed(() => resourcesStore.resourceDetails);
const allowedValueDetail = computed(
  () => allowedValuesStore.allowedValueDetails,
);

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", clazzOptions.value[0]);
};

const updateAllowedValueDetail = (key, value) => {
  allowedValuesStore.setAllowedValueDetail({
    [key]: value,
  });
};

const resourceClazz = computed(() => formData.value?.clazz);

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const clazzOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "clazz"),
);
const quantityTypeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "quantityType"),
);
const typeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "type"),
);
const qualityOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "quality"),
);
const shapeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "shape"),
);
const shapeSpecificationOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "shapeSpecification"),
);
const colorOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "color"),
);
const colorHueOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "colorHue"),
);
const sizeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "size"),
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(allowedValuesStore, resourceClazz);
  isFetching.value = false;

  setInitialAllowedValueDetails();
  setInitialType(resourceClazz.value, resourcesStore, route);
};

const resetForm = computed(() => allowedValuesStore.allowedValuesReset);

// When fullPath changes, reinitialize allowed value details
// When resetForm changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => resetForm.value],
  () => {
    setInitialAllowedValueDetails();
    allowedValuesStore.setAllowedValueReset(false);
  },
  { immediate: true },
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
