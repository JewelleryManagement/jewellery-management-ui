<template>
  <AllowedValueComboBox
    v-model="formData.type"
    :items="typeOptions"
    label="Type"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="type"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
  />

  <v-text-field
    v-model="formData.size"
    :counter="10"
    :rules="numberFieldRules"
    label="Size"
    required
  ></v-text-field>

  <AllowedValueComboBox
    v-model="formData.quality"
    :items="qualityOptions"
    label="Quality"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="quality"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
  />

  <AllowedValueComboBox
    v-model="formData.quantityType"
    :items="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="quantityType"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
  />

  <AllowedValueComboBox
    v-model="formData.color"
    :items="colorOptions"
    label="Color"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="color"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
  />

  <AllowedValueComboBox
    v-model="formData.shape"
    :items="shapeOptions"
    label="Shape"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="shape"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
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
    required
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const resourceClazz = computed(() => formData.value?.clazz || "Pearl");

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const typeOptions = ref([]);
const qualityOptions = ref([]);
const quantityTypeOptions = ref([]);
const colorOptions = ref([]);
const shapeOptions = ref([]);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "type",
    "quality",
    "quantityType",
    "color",
    "shape",
  ]);

  typeOptions.value = getAllowedValue(store, resourceClazz, "type");
  qualityOptions.value = getAllowedValue(store, resourceClazz, "quality");
  quantityTypeOptions.value = getAllowedValue(
    store,
    resourceClazz,
    "quantityType"
  );
  colorOptions.value = getAllowedValue(store, resourceClazz, "color");
  shapeOptions.value = getAllowedValue(store, resourceClazz, "shape");

  isFetching.value = false;
};

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
