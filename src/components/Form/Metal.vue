<template>
  <!-- Minimal Vuetify 3 v-combobox test for 'Type' field -->
  <AllowedValueComboBox
    v-model="formData.type"
    :items="typeOptions"
    label="Type"
    :rules="smallFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="type"
    @deleted="fetchAllowedValues"
  />

  <AllowedValueComboBox
    v-model="formData.quantityType"
    :items="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="quantityType"
    @deleted="fetchAllowedValues"
  />

  <AllowedValueComboBox
    v-model="formData.purity"
    :items="purityOptions"
    label="Purity"
    :rules="numberFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="purity"
    @deleted="fetchAllowedValues"
  />

  <AllowedValueComboBox
    v-model="formData.color"
    :items="colorOptions"
    label="Color"
    :rules="smallFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="color"
    @deleted="fetchAllowedValues"
  />

  <AllowedValueComboBox
    v-model="formData.plating"
    :items="platingOptions"
    label="Plating"
    :rules="smallFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="plating"
    @deleted="fetchAllowedValues"
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
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";
import { addNewAllowedValuesIfNeeded } from "@/utils/allowed-values.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];
console.log("formData:", formData);
console.log("formData.clazz:", formData.clazz);

const resourceClazz = computed(() => {
  const result = formData.clazz || "Metal";
  console.log("resourceClazz computed result:", result);
  return result;
});

// Add a watch to see when resourceClazz changes
watch(resourceClazz, (newValue) => {
  console.log("resourceClazz changed to:", newValue);
});

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const typeOptions = ref([]);
const quantityTypeOptions = ref([]);
const colorOptions = ref([]);
const platingOptions = ref([]);
const purityOptions = ref([]);

const fetchAllowedValues = async () => {
  console.log("fetchAllowedValues - resourceClazz.value:", resourceClazz.value);
  await Promise.all([
    store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: resourceClazz.value, fieldName: "type" }),
    store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: resourceClazz.value, fieldName: "quantityType" }),
    store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: resourceClazz.value, fieldName: "color" }),
    store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: resourceClazz.value, fieldName: "plating" }),
    store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: resourceClazz.value, fieldName: "purity" }),
  ]);
  typeOptions.value = store.getters["allowedValues/getAllowedValues"](resourceClazz.value, "type");
  quantityTypeOptions.value = store.getters["allowedValues/getAllowedValues"](resourceClazz.value, "quantityType");
  colorOptions.value = store.getters["allowedValues/getAllowedValues"](resourceClazz.value, "color");
  platingOptions.value = store.getters["allowedValues/getAllowedValues"](resourceClazz.value, "plating");
  purityOptions.value = store.getters["allowedValues/getAllowedValues"](resourceClazz.value, "purity");
};

onMounted(fetchAllowedValues);
watch(resourceClazz, fetchAllowedValues);
</script>
<style scoped></style>
