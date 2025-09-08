<template>
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
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="quality"
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
    v-model="formData.shape"
    :items="shapeOptions"
    label="Shape"
    :rules="smallFieldRules"
    :required="true"
    :resource-clazz="resourceClazz"
    field-name="shape"
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
import { useStore } from "vuex";
import { computed, watch } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const smallFieldRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz || "Pearl");

// Computed properties for allowed values
const typeOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Pearl", "type") || []
);
const qualityOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Pearl", "quality") || []
);
const quantityTypeOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Pearl", "quantityType") || []
);
const colorOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Pearl", "color") || []
);
const shapeOptions = computed(() => 
  store.getters["allowedValues/getAllowedValues"]("Pearl", "shape") || []
);

// Fetch allowed values when component mounts
const fetchAllowedValues = async () => {
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Pearl", fieldName: "type" });
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Pearl", fieldName: "quality" });
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Pearl", fieldName: "quantityType" });
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Pearl", fieldName: "color" });
  await store.dispatch("allowedValues/fetchAllowedValues", { resourceClazz: "Pearl", fieldName: "shape" });
};

// Fetch allowed values when component mounts
fetchAllowedValues();
</script>
<style scoped></style>
