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
    v-model:allowed-value-details="allowedValueDetail.quantityType"
    :items="quantityTypeOptions"
    label="Quantity Type"
    :rules="smallInputRules"
    :resource-clazz="resourceClazz"
    field-name="quantityType"
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
    :counter="50"
    :rules="largeFieldRules"
    rows="2"
    label="Note"
    required
  ></v-textarea>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, ref, watch } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import {
  useTextFieldRules,
  useTextAreaFieldRules,
  useTextFieldLargeRules,
  useNumberFieldRules,
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
  clazz: { value: "Element", sku: "E" },
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", initialAllowedValueDetails.clazz);
};

const updateAllowedValueDetail = (key, value) => {
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const resourceClazz = computed(() => formData.value?.clazz || "Element");

const smallInputRules = useTextFieldRules();
const largeFieldRules = useTextFieldLargeRules();
const descriptionRules = useTextAreaFieldRules();
const numberFieldRules = useNumberFieldRules();

const quantityTypeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "quantityType")
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, ["quantityType"]);

  isFetching.value = false;
};

// When fullPath changes, reinitialize allowed value details
// immediate: true - execute on first render
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
