<template>
  <v-select
    v-model="formData.quantityType"
    :items="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallFieldRules"
    clearable
  />

  <AllowedValueComboBox
    v-model="formData.type"
    v-model:allowed-value-details="allowedValueDetail.type"
    :items="typeOptions"
    label="Type"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="type"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.quality"
    v-model:allowed-value-details="allowedValueDetail.quality"
    :items="qualityOptions"
    label="Quality"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="quality"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.shape"
    v-model:allowed-value-details="allowedValueDetail.shape"
    :items="shapeOptions"
    label="Shape"
    :required="true"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="shape"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.shapeSpecification"
    v-model:allowed-value-details="allowedValueDetail.shapeSpecification"
    :items="shapeSpecificationOptions"
    label="Shape Specification"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="shapeSpecification"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.color"
    v-model:allowed-value-details="allowedValueDetail.color"
    :items="colorOptions"
    label="Color"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="color"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.colorHue"
    v-model:allowed-value-details="allowedValueDetail.colorHue"
    :items="colorHueOptions"
    label="Color Hue"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="colorHue"
    :is-fetched="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.size"
    v-model:allowed-value-details="allowedValueDetail.size"
    :items="sizeOptions"
    label="Size"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="Size"
    :is-fetched="isFetching"
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
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
  useInputValidate,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useStore();
const formData = computed(() => store.getters["resources/getResourceDetails"]);
const allowedValueDetail = computed(
  () => store.getters["allowedValues/getAllowedValueDetails"]
);

const initialAllowedValueDetails = {
  clazz: { value: "pearl", sku: "P" },
  Strand: { value: "Strand", sku: "S" },
  Piece: { value: "Piece", sku: "P" },
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", initialAllowedValueDetails.clazz);

  updateAllowedValueDetail(
    "quantityType",
    initialAllowedValueDetails[formData.value.quantityType]
  );
};

const updateAllowedValueDetail = (key, value) => {
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const resourceClazz = computed(() => formData.value?.clazz || "Pearl");

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const typeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "type")
);
const qualityOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "quality")
);
const quantityTypeOptions = ["Strand", "Piece"];
const colorOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "color")
);
const colorHueOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "colorHue")
);
const shapeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shape")
);
const shapeSpecificationOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shapeSpecification")
);
const sizeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "size")
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "type",
    "quality",
    "quantityType",
    "color",
    "shape",
    "shapeSpecification",
    "colorHue",
    "size",
  ]);

  isFetching.value = false;
};

watch(
  () => formData.value.quantityType,
  (newVal) => {
    updateAllowedValueDetail(
      "quantityType",
      initialAllowedValueDetails[newVal]
    );
  }
);

watch(
  () => route.fullPath,
  () => {
    setInitialAllowedValueDetails();
  },
  { immediate: true }
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
