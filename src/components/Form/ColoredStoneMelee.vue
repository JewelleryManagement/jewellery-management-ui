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
    v-model="formData.shape"
    v-model:allowed-value-details="allowedValueDetail.shape"
    label="Shape"
    :items="shapeOptions"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="shape"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.size"
    v-model:allowed-value-details="allowedValueDetail.size"
    :items="sizeOptions"
    label="Size"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="size"
    :is-fetching="isFetching"
  />

  <v-text-field
    v-model="formData.carat"
    :rules="numberFieldRules"
    label="Carat"
    required
  ></v-text-field>

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
    v-model="formData.colorHue"
    v-model:allowed-value-details="allowedValueDetail.colorHue"
    :items="colorHueOptions"
    label="Color Hue"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="colorHue"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.clarity"
    v-model:allowed-value-details="allowedValueDetail.clarity"
    :items="clarityOptions"
    label="Clarity"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="clarity"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.cut"
    v-model:allowed-value-details="allowedValueDetail.cut"
    :items="cutOptions"
    label="Cut"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="cut"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.treatment"
    v-model:allowed-value-details="allowedValueDetail.treatment"
    :display-sku="false"
    :items="treatmentOptions"
    label="Treatment"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="treatment"
    :is-fetching="isFetching"
  />

  <v-text-field
    v-model="formData.pricePerQuantity"
    :rules="numberFieldRules"
    label="Price Per Unit"
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
  clazz: { value: "ColoredStone", sku: "CS" },
  quantityType: { value: "Piece", sku: "M" },
  Sapphire: { value: "Sapphire", sku: "Sp" },
  Ruby: { value: "Ruby", sku: "Ru" },
  Emerald: { value: "Emerald", sku: "Em" },
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
    initialAllowedValueDetails.quantityType.value
  );
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", initialAllowedValueDetails.clazz);
  updateAllowedValueDetail(
    "quantityType",
    initialAllowedValueDetails.quantityType
  );
};

const updateResourceDetails = (key, value) =>
  store.dispatch("resources/setResourceDetailsField", { key, value });

const updateAllowedValueDetail = (key, value) => {
  store.dispatch("allowedValues/setAllowedValueDetail", {
    [key]: value,
  });
};

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz || "DiamondMelee");

const typeOptions = ["Sapphire", "Ruby", "Emerald"];
const shapeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shape")
);
const sizeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "size")
);
const colorOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "color")
);
const colorHueOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "colorHue")
);
const clarityOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "clarity")
);
const cutOptions = computed(() => getAllowedValue(store, resourceClazz, "cut"));
const treatmentOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "treatment")
);

const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "shape",
    "size",
    "color",
    "colorHue",
    "clarity",
    "cut",
    "treatment",
  ]);

  isFetching.value = false;
};

// When type changes, update the store with the new allowed value (e.g. { type: "Sapphire", sku: "Sp" })
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
