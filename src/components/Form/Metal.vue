<template>
  <v-text-field
    v-model="formData.quantityType"
    label="Quantity Type"
    readonly
  />

  <v-select
    v-model="formData.type"
    :items="typeOptions"
    label="Type"
    :rules="useInputValidate()"
    clearable
  />

  <AllowedValueComboBox
    v-model="formData.color"
    v-model:allowed-value-details="allowedValueDetail.color"
    :items="colorOptions"
    label="Color"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="color"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.purity"
    v-model:allowed-value-details="allowedValueDetail.purity"
    :items="purityOptions"
    label="Purity"
    :rules="numberFieldRules"
    :resource-clazz="resourceClazz"
    field-name="purity"
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
  clazz: { value: "Metal", sku: "M" },
  quantityType: "Weight ",
  Gold: { value: "Gold", sku: "G" },
  Silver: { value: "Silver", sku: "S" },
  Platinum: { value: "Platinum", sku: "P" },
  Other: { value: "Other", sku: "O" },
};

const setInitialValues = () => {
  if (!formData.value.quantityType) {
    setInitialResourceDetails();
  }
  setInitialAllowedValueDetails();
};

const setInitialResourceDetails = () => {
  updateResourceDetails(
    "quantityType",
    initialAllowedValueDetails.quantityType
  );
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", initialAllowedValueDetails.clazz);
};

const updateResourceDetails = (key, value) =>
  store.dispatch("resources/setResourceDetailsField", { key, value });

const updateAllowedValueDetail = (key, value) => {
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const resourceClazz = computed(() => {
  const result = formData.clazz || "Metal";
  return result;
});

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const typeOptions = ["Gold", "Silver", "Platinum", "Other"];
const colorOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "color")
);
const purityOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "purity")
);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, ["color", "purity"]);

  isFetching.value = false;
};

// When quantityType changes, update the store with the new allowed value (e.g. { type: "Gold", sku: "G" })
// immediate: true - execute on first render
watch(
  () => formData.value.type,
  (newValue) => {
    if (newValue) {
      updateAllowedValueDetail("type", initialAllowedValueDetails[newValue]);
    }
  },
  { immediate: true }
);

// When fullPath changes, reinitialize allowed value details and quantityType
// When quantityType changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => formData.value.quantityType],
  () => {
    setInitialValues();
  },
  { immediate: true }
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
