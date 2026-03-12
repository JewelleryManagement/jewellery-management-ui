<template>
  <v-text-field
    v-model="formData.quantityType"
    label="Quantity Type"
    readonly
  />

  <AllowedValueSelect
    v-model="formData.type"
    v-model:allowed-value-details="allowedValueDetail.type"
    :stored-allowed-values="typeOptions"
    label="Type"
    :rules="useInputValidate()"
  />

  <AllowedValueComboBox
    v-model="formData.shape"
    v-model:allowed-value-details="allowedValueDetail.shape"
    label="Shape"
    :storedAllowedValues="shapeOptions"
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
    :storedAllowedValues="caratOptions"
    :display-storedAllowedValues="false"
    label="Carat"
    :rules="numberFieldRules"
    :resource-clazz="resourceClazz"
    field-name="carat"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.color"
    v-model:allowed-value-details="allowedValueDetail.color"
    :storedAllowedValues="colorOptions"
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
    :storedAllowedValues="colorHueOptions"
    label="Color Hue"
    :rules="useTextFieldRules()"
    :resource-clazz="resourceClazz"
    field-name="colorHue"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.clarity"
    v-model:allowed-value-details="allowedValueDetail.clarity"
    :storedAllowedValues="clarityOptions"
    label="Clarity"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="clarity"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.cut"
    v-model:allowed-value-details="allowedValueDetail.cut"
    :storedAllowedValues="cutOptions"
    label="Cut"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="cut"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.polish"
    v-model:allowed-value-details="allowedValueDetail.polish"
    :storedAllowedValues="polishOptions"
    label="Polish"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="polish"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.symmetry"
    v-model:allowed-value-details="allowedValueDetail.symmetry"
    :storedAllowedValues="symmetryOptions"
    label="Symmetry"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="symmetry"
    :is-fetching="isFetching"
  />

  <AllowedValueComboBox
    v-model="formData.fluorescence"
    v-model:allowed-value-details="allowedValueDetail.fluorescence"
    :storedAllowedValues="fluorescenceOptions"
    label="Fluorescence"
    :rules="smallFieldRules"
    :resource-clazz="resourceClazz"
    field-name="fluorescence"
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
    :storedAllowedValues="certificateOptions"
    :displayStoredAllowedValues="false"
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
import { computed, onMounted, ref, watch } from "vue";
import AllowedValueComboBox from "./AllowedValueComboBox.vue";
import AllowedValueSelect from "./AllowedValueSelect.vue";
import {
  useTextFieldRules,
  useNumberFieldRules,
  useTextFieldLargeRules,
  useInputValidate,
} from "../../utils/validation-rules.js";
import { fetchAllowedValues, getAllowedValue } from "@/utils/allowed-values.js";
import { useRoute } from "vue-router";
import { setInitialType } from "../../utils/resource-util";
import { useAllowedValuesStore } from "@/store/allowedValues";
import { useResourcesStore } from "@/store/resources";

const route = useRoute();
const allowedValuesStore = useAllowedValuesStore();
const resourcesStore = useResourcesStore();
const formData = computed(() => resourcesStore.resourceDetails);
const allowedValueDetail = computed(
  () => allowedValuesStore.allowedValueDetails,
);

const setInitialValues = () => {
  if (!formData.value.quantityType) {
    setInitialResourceDetails();
  }
  setInitialAllowedValueDetails();
};

const setInitialResourceDetails = () => {
  const quantityTypeValue = quantityTypeOptions.value[0]?.value;

  if (quantityTypeValue) {
    updateResourceDetails("quantityType", quantityTypeValue);
  }
};

const setInitialAllowedValueDetails = () => {
  updateAllowedValueDetail("clazz", clazzOptions.value[0]);
};

const updateResourceDetails = (key, value) =>
  resourcesStore.setResourceDetailsField({ key, value });

const updateAllowedValueDetail = (key, value) => {
  allowedValuesStore.setAllowedValueDetail({
    [key]: value,
  });
};

const smallFieldRules = [...useInputValidate(), ...useTextFieldRules()];
const largeFieldRules = useTextFieldLargeRules();
const numberFieldRules = useNumberFieldRules();

const resourceClazz = computed(() => formData.value?.clazz);

const clazzOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "clazz"),
);
const quantityTypeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "quantityType"),
);
const typeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "type"),
);
const shapeOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "shape"),
);
const caratOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "carat"),
);

const colorOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "color"),
);

const colorHueOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "colorHue"),
);
const clarityOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "clarity"),
);
const cutOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "cut"),
);

const polishOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "polish"),
);
const symmetryOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "symmetry"),
);
const fluorescenceOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "fluorescence"),
);
const certificateOptions = computed(() =>
  getAllowedValue(allowedValuesStore, resourceClazz, "certificate"),
);
const isFetching = ref(true);

const fetchAllowedValuesOptions = async () => {
  await fetchAllowedValues(allowedValuesStore, resourceClazz);
  isFetching.value = false;

  setInitialValues();
  setInitialType(resourceClazz.value, resourcesStore, route);
};

const resetForm = computed(() => allowedValuesStore.allowedValuesReset);

// When fullPath changes, reinitialize allowed value details and quantityType
// When resetForm changes, reinitialize allowed value details (e.g. after a reset)
// immediate: true - execute on first render
watch(
  [() => route.fullPath, () => resetForm.value],
  () => {
    setInitialValues();
    allowedValuesStore.setAllowedValueReset(false);
  },
  { immediate: true },
);

onMounted(fetchAllowedValuesOptions);
</script>
<style scoped></style>
