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
    :resource-clazz="resourceClazz"
    field-name="quantityType"
    :is-fetched="isFetching"
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
import { computed, onMounted, ref } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useTextAreaFieldRules,
  useTextFieldLargeRules,
  useNumberFieldRules,
} from "../../utils/validation-rules.js";

const store = useStore();
const formData = store.getters["resources/getResourceDetails"];

const resourceClazz = computed(() => formData.value?.clazz || "Element");

const smallInputRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const descriptionRules = useTextAreaFieldRules();
const numberFieldRules = useNumberFieldRules();
const isFetching = ref(true);

const quantityTypeOptions = computed(
  () =>
    store.getters["allowedValues/getAllowedValues"](
      "Element",
      "quantityType"
    ) || []
);

const fetchAllowedValues = async () => {
  await store.dispatch("allowedValues/fetchAllowedValues", {
    resourceClazz: "Element",
    fieldName: "quantityType",
  });

  isFetching.value = false;
};

onMounted(fetchAllowedValues);
</script>
<style scoped></style>
