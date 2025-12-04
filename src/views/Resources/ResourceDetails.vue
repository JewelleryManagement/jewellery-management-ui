<template>
  <v-container class="my-12" fluid>
    <div class="mx-auto text-center mb-6 text-h5">
      {{ pageTitle }}
    </div>

    <v-sheet width="470" class="mx-auto">
      <v-select
        v-model="selected"
        :items="options"
        label="Select resource type"
        :disabled="isEditState || isDuplicateState || route.query.clazz"
      ></v-select>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <Pearl v-if="selected === 'Pearl'" />
        <Metal v-if="selected === 'Metal'" />
        <Diamond v-if="selected === 'Diamond'" />
        <DiamondMelee v-if="selected === 'DiamondMelee'" />
        <ColoredStone v-if="selected === 'ColoredStone'" />
        <ColoredStoneMelee v-if="selected === 'ColoredStoneMelee'" />
        <SemiPreciousStone v-if="selected === 'SemiPreciousStone'" />
        <Element v-if="selected === 'Element'" />

        <div class="d-flex justify-center" v-if="selected">
          <v-text-field
            v-model="sku"
            label="Stock Keeping Unit"
            max-width="300"
            :rules="largeFieldRules"
            required
            clearable
          ></v-text-field>

          <div class="d-flex justify-center mt-3 ml-5">
            <v-btn color="primary" @click="generateSku"> Generate </v-btn>
          </div>
        </div>

        <div v-if="selected" class="d-flex flex-column">
          <form-buttons @reset-form="resetForm" />
        </div>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import Pearl from "@/components/Form/Pearl.vue";
import Metal from "@/components/Form/Metal.vue";
import Diamond from "@/components/Form/Diamond.vue";
import Element from "@/components/Form/Element.vue";
import DiamondMelee from "@/components/Form/DiamondMelee.vue";
import ColoredStone from "@/components/Form/ColoredStone.vue";
import ColoredStoneMelee from "@/components/Form/ColoredStoneMelee.vue";
import SemiPreciousStone from "@/components/Form/SemiPreciousStone.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { addNewAllowedValuesIfNeeded } from "@/utils/allowed-values.js";
import {
  useTextFieldLargeRules,
  useInputValidate,
} from "@/utils/validation-rules";

const largeFieldRules = [...useInputValidate(), ...useTextFieldLargeRules()];

const props = defineProps({
  id: String,
});
const store = useStore();
const route = useRoute();
const router = useRouter();
const options = ref([
  "Pearl",
  "Metal",
  "Element",
  "Diamond",
  "DiamondMelee",
  "ColoredStone",
  "ColoredStoneMelee",
  "SemiPreciousStone",
]);
const pageTitle = computed(() =>
  store.getters["resources/getTitle"](selected.value)
);

const resourceDetails = computed(
  () => store.getters["resources/getResourceDetails"]
);
const snackbarProvider = inject("snackbarProvider");
const selected = ref("");
const isEditState = computed(() => route.path.startsWith("/resources/edit"));
const isDuplicateState = computed(() =>
  route.path.startsWith("/resources/duplicate")
);
const allowedValueDetail = computed(
  () => store.getters["allowedValues/getAllowedValueDetails"]
);

const form = ref(null);

const sku = ref("");

const columnGettersMap = {
  Element: "resources/getColumnsForElement",
  Pearl: "resources/getColumnsForPearl",
  Metal: "resources/getColumnsForMetal",
  Diamond: "resources/getColumnsForDiamond",
  DiamondMelee: "resources/getColumnsForDiamondMelee",
  ColoredStone: "resources/getColumnsForColoredStone",
  ColoredStoneMelee: "resources/getColumnsForColoredStoneMelee",
  SemiPreciousStone: "resources/getColumnsForSemiPreciousStone",
};

const generateSku = () => {
  const getterName = columnGettersMap[selected.value];
  const order = store.getters[getterName || "resources/getColumns"];

  sku.value = order
    .map((col) => allowedValueDetail.value[col.key]?.sku)
    .filter((s) => s && s !== "")
    .join(".");
};

const loadResourceDetails = () => {
  if (isEditState.value || isDuplicateState.value) {
    const resourceDetails = computed(() =>
      store.getters["resources/getResourceById"](props.id)
    );
    store.dispatch("resources/setResourceDetails", resourceDetails.value);
    selected.value = resourceDetails.value.clazz;
    sku.value = resourceDetails.value.sku;
  }
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    store.dispatch("allowedValues/clearAllowedValueDetails");
  }
};

const clearAllowedValueDetails = () => {
  store.dispatch("allowedValues/clearAllowedValueDetails");
};

const clearResourceDetails = (clazz) => {
  store.dispatch("resources/setResourceDetails", { clazz: clazz });
};

const handleRouteChange = () => {
  clearAllowedValueDetails();

  if (!isEditState.value && !isDuplicateState.value) {
    sku.value = "";
  }

  if (route.query.clazz) {
    selected.value = route.query.clazz;
    clearResourceDetails(selected.value);
  }

  if (route.path.startsWith("/resources/add") && !route.query.clazz) {
    selected.value = "";
  } else {
    loadResourceDetails();
  }
};

// Handle all route fullPath changes: reset state and process clazz logic.
watch(
  () => route.fullPath,
  () => {
    handleRouteChange();
  },
  { immediate: true }
);

const clearState = (newValue) => {
  if (!isEditState.value && !isDuplicateState.value) {
    clearResourceDetails(newValue);
  }
  clearAllowedValueDetails;
};

//when selected changes, clear ResourceDetails and AllowedValueDetails state
watch(selected, (newValue) => {
  clearState(newValue);
});

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    if (isEditState.value) {
      editResource();
    } else {
      createResource();
    }
  }
};

const getQuery = () => {
  return (
    store.getters["resources/getResourceQuery"](
      selected.value,
      resourceDetails.value.type
    ) ||
    store.getters["resources/getResourceQuery"](
      selected.value,
      resourceDetails.value.quantityType
    )
  );
};

const navigateToResourcePage = () => {
  const query =
    selected.value === "Element" ? { clazz: "Element" } : getQuery();
  router.push({
    path: "/resources",
    query: query,
  });
};

const editResource = async () => {
  try {
    await addNewAllowedValuesIfNeeded(
      store,
      selected.value,
      allowedValueDetail.value
    );
    await store.dispatch("resources/updateResource", {
      ...resourceDetails.value,
      sku: sku.value,
    });
    snackbarProvider.showSuccessSnackbar("Successfully edited resource!");
    navigateToResourcePage();
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const createResource = async () => {
  try {
    await addNewAllowedValuesIfNeeded(
      store,
      selected.value,
      allowedValueDetail.value
    );
    await store.dispatch("resources/createResource", {
      ...resourceDetails.value,
      sku: sku.value,
    });
    snackbarProvider.showSuccessSnackbar("Successfully created resource!");
    navigateToResourcePage();
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
