<template>
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
    v-model="formData.cut"
    :items="cutOptions"
    label="Cut"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="cut"
    :is-fetched="isFetching"
    @deleted="fetchAllowedValuesOptions"
  />

  <AllowedValueComboBox
    v-model="formData.clarity"
    :items="clarityOptions"
    label="Clarity"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="clarity"
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

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(
  () => formData.value?.clazz || "SemiPreciousStone"
);

const colorOptions = ref([]);
const cutOptions = ref([]);
const clarityOptions = ref([]);
const quantityTypeOptions = ref([]);
const shapeOptions = ref([]);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "color",
    "cut",
    "clarity",
    "quantityType",
    "shape",
  ]);

  colorOptions.value = getAllowedValue(store, resourceClazz, "color");
  cutOptions.value = getAllowedValue(store, resourceClazz, "cut");
  clarityOptions.value = getAllowedValue(store, resourceClazz, "clarity");
  quantityTypeOptions.value = getAllowedValue(
    store,
    resourceClazz,
    "quantityType"
  );
  shapeOptions.value = getAllowedValue(store, resourceClazz, "shape");

  isFetching.value = false;
};

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
