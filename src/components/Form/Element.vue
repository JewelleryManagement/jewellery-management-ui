<template>
  <v-textarea
    v-model="formData.description"
    :counter="100"
    :rules="descriptionRules"
    rows="2"
    label="Description"
    required
  ></v-textarea>

  <AllowedValueComboBox
    v-model="formData.quantityType"
    :items="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallInputRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="quantityType"
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
    :counter="50"
    :rules="largeFieldRules"
    rows="2"
    label="Note"
    required
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, watch } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useTextAreaFieldRules,
  useTextFieldLargeRules,
  useNumberFieldRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const smallInputRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const descriptionRules = useTextAreaFieldRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz || "Element");

// Computed properties for allowed values
const quantityTypeOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Element", "quantityType") || []
);

// Fetch allowed values when component mounts
const fetchAllowedValues = async () => {
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Element", fieldName: "quantityType" });
};

// Fetch allowed values when component mounts
fetchAllowedValues();
</script>
<style scoped></style>
