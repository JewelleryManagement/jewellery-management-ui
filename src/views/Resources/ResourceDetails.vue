<template>
  <v-container class="my-12" fluid>
    <div class="mx-auto text-center mb-6 text-h5">
      {{ fullTitle }}
    </div>

    <v-sheet width="470" class="mx-auto">
      <v-select
        v-model="selectedClazz"
        :items="options"
        label="Select resource type"
        :disabled="isEditState || isDuplicateState || route.query.clazz"
      ></v-select>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <Pearl v-if="selectedClazz === PEARL_CLAZZ" />
        <Diamond v-if="selectedClazz === DIAMOND_CLAZZ" />
        <DiamondMelee v-if="selectedClazz === DIAMON_MELEE_CLAZZ" />
        <ColoredStone v-if="selectedClazz === COLORED_STONE_CLAZZ" />
        <ColoredStoneMelee v-if="selectedClazz === COLORED_STONE_MELEE_CLAZZ" />
        <SemiPreciousStone v-if="selectedClazz === SEMI_PRECIOUS_STONE_CLAZZ" />
        <Metal v-if="selectedClazz === METAL_CLAZZ" />
        <Element v-if="selectedClazz === ELEMENT_CLAZZ" />

        <div class="d-flex justify-center" v-if="selectedClazz">
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

        <div v-if="selectedClazz" class="d-flex flex-column">
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
import {
  PEARL_CLAZZ,
  DIAMOND_CLAZZ,
  DIAMON_MELEE_CLAZZ,
  COLORED_STONE_CLAZZ,
  COLORED_STONE_MELEE_CLAZZ,
  SEMI_PRECIOUS_STONE_CLAZZ,
  METAL_CLAZZ,
  ELEMENT_CLAZZ,
} from "@/utils/clazzConstants";
import { getQuery } from "@/components/Form/ResourceUtil";

const largeFieldRules = [...useInputValidate(), ...useTextFieldLargeRules()];

const props = defineProps({
  id: String,
});
const store = useStore();
const route = useRoute();
const router = useRouter();
const options = ref([
  PEARL_CLAZZ,
  DIAMOND_CLAZZ,
  DIAMON_MELEE_CLAZZ,
  COLORED_STONE_CLAZZ,
  COLORED_STONE_MELEE_CLAZZ,
  SEMI_PRECIOUS_STONE_CLAZZ,
  METAL_CLAZZ,
  ELEMENT_CLAZZ,
]);
const pageTitle = computed(
  () => store.getters["resources/getTitle"](selectedClazz.value) || "Resource"
);

const resourceDetails = computed(
  () => store.getters["resources/getResourceDetails"]
);
const snackbarProvider = inject("snackbarProvider");
const selectedClazz = ref("");
const isEditState = computed(() => route.path.startsWith("/resources/edit"));
const isDuplicateState = computed(() =>
  route.path.startsWith("/resources/duplicate")
);
const allowedValueDetail = computed(
  () => store.getters["allowedValues/getAllowedValueDetails"]
);

const actionTitle = computed(() => {
  if (isEditState.value) return "Edit";
  if (isDuplicateState.value) return "Duplicate";
  return "Add";
});

const fullTitle = computed(() => `${actionTitle.value} ${pageTitle.value}`);

const form = ref(null);

const sku = ref("");

const generateSku = () => {
  const order = store.getters["allowedValues/getAllowedFieldsByType"](
    selectedClazz.value
  );

  sku.value = order
    .map((col) => allowedValueDetail.value[col]?.sku)
    .filter((s) => s && s !== "")
    .join(".");
};

const loadResourceDetails = () => {
  if (isEditState.value || isDuplicateState.value) {
    const resourceDetails = computed(() =>
      store.getters["resources/getResourceById"](props.id)
    );
    store.dispatch("resources/setResourceDetails", resourceDetails.value);
    selectedClazz.value = resourceDetails.value.clazz;
    sku.value = resourceDetails.value.sku;
  }
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    clearAllowedValueDetails();
    store.dispatch("allowedValues/setAllowedValueReset", true);
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
    selectedClazz.value = route.query.clazz;
    clearResourceDetails(selectedClazz.value);
  }

  if (route.path.startsWith("/resources/add") && !route.query.clazz) {
    selectedClazz.value = "";
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

//when selectedClazz changes, clear ResourceDetails and AllowedValueDetails state
watch(selectedClazz, (newValue) => {
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

const navigateToResourceQuantityPage = (result) => {
  router.push({
    name: "Add-Quantity",
    params: { resourceId: result.id },
  });
};

const navigateToResourcePage = () => {
  const query = getQuery(resourceDetails.value, store);
  router.push({
    path: "/resources",
    query: query,
  });
};

const editResource = async () => {
  try {
    await addNewAllowedValuesIfNeeded(
      store,
      selectedClazz.value,
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
      selectedClazz.value,
      allowedValueDetail.value
    );
    const result = await store.dispatch("resources/createResource", {
      ...resourceDetails.value,
      sku: sku.value,
    });
    snackbarProvider.showSuccessSnackbar("Successfully created resource!");
    navigateToResourceQuantityPage(result);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
