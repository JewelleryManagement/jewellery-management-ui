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
    v-model="formData.purity"
    :items="purityOptions"
    label="Purity"
    :rules="numberFieldRules"
    :resource-clazz="resourceClazz"
    field-name="purity"
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
    v-model="formData.plating"
    :items="platingOptions"
    label="Plating"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="plating"
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
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const resourceClazz = computed(() => {
  const result = formData.clazz || "Metal";
  return result;
});

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const typeOptions = ref([]);
const quantityTypeOptions = ref([]);
const colorOptions = ref([]);
const platingOptions = ref([]);
const purityOptions = ref([]);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "type",
    "quantityType",
    "color",
    "plating",
    "purity",
  ]);

  typeOptions.value = getAllowedValue(store, resourceClazz, "type");
  quantityTypeOptions.value = getAllowedValue(
    store,
    resourceClazz,
    "quantityType"
  );
  colorOptions.value = getAllowedValue(store, resourceClazz, "color");
  platingOptions.value = getAllowedValue(store, resourceClazz, "plating");
  purityOptions.value = getAllowedValue(store, resourceClazz, "purity");

  isFetching.value = false;
};

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
