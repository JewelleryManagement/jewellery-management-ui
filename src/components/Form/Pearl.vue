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
    field-name="Size"
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
import { setInitialType } from "./ResourceUtil";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useStore();
const formData = computed(() => store.getters["resources/getResourceDetails"]);
const allowedValueDetail = computed(
  () => store.getters["allowedValues/getAllowedValueDetails"]
);

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", clazzOptions.value[0]);
};

const updateAllowedValueDetail = (key, value) => {
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const resourceClazz = computed(() => formData.value?.clazz);

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const clazzOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "clazz")
);
const quantityTypeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "quantityType")
);
const typeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "type")
);
const qualityOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "quality")
);
const shapeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shape")
);
const shapeSpecificationOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shapeSpecification")
);
const colorOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "color")
);
const colorHueOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "colorHue")
);
const sizeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "size")
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz);
  isFetching.value = false;

  setInitialAllowedValueDetails();
  setInitialType(resourceClazz.value, store, route);
};

const resetForm = computed(
  () => store.getters["allowedValues/getAllowedValueReset"]
);

// When fullPath changes, reinitialize allowed value details
// When resetForm changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => resetForm.value],
  () => {
    setInitialAllowedValueDetails();
    store.dispatch("allowedValues/setAllowedValueReset", false);
  },
  { immediate: true }
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
