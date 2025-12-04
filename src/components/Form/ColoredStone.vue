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

  <v-text-field
    v-model="formData.dimensionX"
    :counter="10"
    :rules="numberFieldRules"
    label="Length"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionY"
    :counter="10"
    :rules="numberFieldRules"
    label="Width"
    required
  ></v-text-field>

  <v-text-field
    v-model="formData.dimensionZ"
    :counter="10"
    :rules="numberFieldRules"
    label="Depth"
    required
  ></v-text-field>

  <AllowedValueComboBox
    v-model="formData.carat"
    v-model:allowed-value-details="allowedValueDetail.carat"
    :items="caratOptions"
    :display-items="false"
    label="Carat"
    :rules="numberFieldRules"
    :resource-clazz="resourceClazz"
    field-name="carat"
    :is-fetching="isFetching"
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
    v-model="formData.colorHue"
    v-model:allowed-value-details="allowedValueDetail.colorHue"
    :display-sku="false"
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

  <AllowedValueComboBox
    v-model="formData.certificate"
    v-model:allowed-value-details="allowedValueDetail.certificate"
    :items="certificateOptions"
    :display-items="false"
    label="Certificate"
    :rules="useTextFieldLargeRules()"
    :resource-clazz="resourceClazz"
    field-name="certificate"
    :is-fetching="isFetching"
  />

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
  clazz: { value: "coloredStone", sku: "CS" },
  quantityType: "Piece",
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

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz || "Diamond");

const typeOptions = ["Sapphire", "Ruby", "Emerald"];
const shapeOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "shape")
);
const caratOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "carat")
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
const certificateOptions = computed(() =>
  getAllowedValue(store, resourceClazz, "certificate")
);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(store, resourceClazz, [
    "shape",
    "carat",
    "color",
    "colorHue",
    "clarity",
    "cut",
    "treatment",
    "certificate",
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
