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
        <PreciousStone v-if="selected === 'PreciousStone'" />
        <SemiPreciousStone v-if="selected === 'SemiPreciousStone'" />
        <Element v-if="selected === 'Element'" />

        <div class="d-flex justify-center" v-if="selected">
          <v-text-field
            v-model="sku"
            label="Stock Keeping Unit"
            max-width="300"
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
import PreciousStone from "@/components/Form/PreciousStone.vue";
import Element from "@/components/Form/Element.vue";
import SemiPreciousStone from "@/components/Form/SemiPreciousStone.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { addNewAllowedValuesIfNeeded } from "@/utils/allowed-values.js";

const props = defineProps({
  id: String,
});
const store = useStore();
const route = useRoute();
const router = useRouter();
const options = ref([
  "Pearl",
  // "Metal",
  // "Element",
  "PreciousStone",
  //"SemiPreciousStone",
]);
const pageTitle = computed(() =>
  route.query.clazz ? `Add ${route.query.clazz}` : route.meta.title
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

const fieldOrder = {
  Pearl: [
    "clazz",
    "quantityType",
    "type",
    "quality",
    "shape",
    "shapeSpecification",
    "color",
    "colorHue",
    "size",
  ],

  PreciousStone: [
    "clazz",
    "type",
    "shape",
    "carat",
    "color",
    "clarity",
    "cut",
    "polish",
    "symmetry",
    "fluorescence",
    "certificate",
  ],
};

const generateSku = () => {
  sku.value = fieldOrder[selected.value]
    .map((key) => allowedValueDetail.value[key]?.sku)
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
  }
};

watch(
  () => route.fullPath,
  () => {
    store.dispatch("allowedValues/clearAllowedValueDetails");
    if (!isEditState.value && !isDuplicateState.value) sku.value = "";
    if (!!route.query.clazz) {
      selected.value = route.query.clazz;
      store.dispatch("resources/setResourceDetails", { clazz: selected.value });
    }
    if (
      route.path.startsWith("/resources/add") &&
      !!route.query.clazz == false
    ) {
      selected.value = "";
    } else loadResourceDetails();
  },
  { immediate: true }
);

watch(selected, (newValue) => {
  if (!isEditState.value && !isDuplicateState.value) {
    store.dispatch("resources/setResourceDetails", { clazz: newValue });
  }
  store.dispatch("allowedValues/clearAllowedValueDetails");
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
const allowedFieldsByType = {
  Metal: ["type", "quantityType", "purity", "color", "plating"],
  Pearl: [
    "type",
    "quantityType",
    "quality",
    "color",
    "shape",
    "shapeSpecification",
    "colorHue",
    "size",
  ],
  PreciousStone: [
    "color",
    "cut",
    "clarity",
    "quantityType",
    "shape",
    "type",
    "carat",
    "polish",
    "symmetry",
    "fluorescence",
    "certificate",
  ],
  SemiPreciousStone: ["color", "cut", "clarity", "quantityType", "shape"],
  Element: ["quantityType"],
};

const editResource = async () => {
  try {
    const fields = allowedFieldsByType[selected.value] || [];
    await addNewAllowedValuesIfNeeded(
      store,
      selected.value,
      allowedValueDetail.value,
      fields
    );
    await store.dispatch("resources/updateResource", resourceDetails.value);
    snackbarProvider.showSuccessSnackbar("Successfully edited resource!");
    router.push({
      path: "/resources",
      query: {
        clazz: selected.value,
        quantityType: resourceDetails.value.quantityType,
      },
    });
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const createResource = async () => {
  try {
    const fields = allowedFieldsByType[selected.value] || [];
    await addNewAllowedValuesIfNeeded(
      store,
      selected.value,
      allowedValueDetail.value,
      fields
    );
    await store.dispatch("resources/createResource", {
      ...resourceDetails.value,
      sku: sku.value,
    });
    snackbarProvider.showSuccessSnackbar("Successfully created resource!");

    const quantityType = ref("");
    if (selected.value === "PreciousStone") {
      quantityType.value = resourceDetails.value.type;
    } else {
      quantityType.value = resourceDetails.value.quantityType;
    }
    router.push({
      path: "/resources",
      query: {
        clazz: selected.value,
        quantityType: quantityType.value,
      },
    });
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
