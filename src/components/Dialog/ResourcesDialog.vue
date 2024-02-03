<template>
  <v-dialog transition="dialog-top-transition" width="auto">
    <template v-slot:default>
      <v-card>
        <v-toolbar color="red" title="Reasources..."></v-toolbar>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="tableColumns"
            :items="resourcesInUser"
            class="elevation-1"
            :search="search"
          >
            <template v-slot:item.addQuantity="{ item }">
              <v-text-field
                clearable
                @click:clear="delete currentInputQuantities[item.id]"
                variant="underlined"
                v-model="currentInputQuantities[item.id]"
                type="number"
                min="0"
                :rules="usePositiveNumberRules(item.quantity)"
                :style="{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  width: '80px',
                }"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="#7986CB" variant="text" @click="clearTableValues"
            >Clear</v-btn
          >
          <v-btn color="green" variant="text" @click="saveTableValues"
            >Save</v-btn
          >
          <v-btn color="red" variant="text" @click="closeDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { usePositiveNumberRules } from "../../utils/validation-rules";
import { ref, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
const snackbarProvider = inject("snackbarProvider");
const route = useRoute();
import { useStore } from "vuex";
const store = useStore();
const isEditPage = route.path.includes("edit");
const emits = defineEmits(["save-resources-dialog", "close-dialog"]);
const props = defineProps({
  inputResources: Array,
  clearTable: Boolean,
});
const search = ref("");
const [currentInputQuantities, savedQuantitiesInProduct] = [
  ref(props.inputResources || []),
  ref([]),
];
const tableColumns = [
  computed(() => store.state.resources.tableColumnAddQuantity).value,
  computed(() => store.state.resources.tableColumnQuantity).value,
  ...computed(() => store.state.resources.tableColumns).value,
];
const resourcesInUser = ref(store.getters["users/getUserResources"]);

const copyCurrentInputQuantities = () => {
  let quantities = [];
  for (const resourceQuantity of currentInputQuantities.value) {
    quantities.push({
      id: resourceQuantity.resource.id,
      quantity: resourceQuantity.quantity,
    });
  }
  return quantities;
};

const addProductQuantitiesToAvailableInUser = () => {
  currentInputQuantities.value.forEach((currentInputQuantity) => {
    let matchingResourceContent = resourcesInUser.value.find(
      (resourceInUser) => resourceInUser.id === currentInputQuantity.resource.id
    );
    if (matchingResourceContent) {
      matchingResourceContent.quantity += currentInputQuantity.quantity;
    } else {
      resourcesInUser.value.push({
        ...currentInputQuantity.resource,
        quantity: currentInputQuantity.quantity,
      });
    }
  });
};
const populateCurrentInputQuantitiesFromSavedInProduct = () => {
  currentInputQuantities.value = [];
  savedQuantitiesInProduct.value.forEach(
    ({ id, quantity }) => (currentInputQuantities.value[id] = quantity)
  );
};

if (isEditPage && currentInputQuantities.value.length > 0) {
  savedQuantitiesInProduct.value = copyCurrentInputQuantities();

  addProductQuantitiesToAvailableInUser();

  populateCurrentInputQuantitiesFromSavedInProduct();
}

const clearTableValues = () => {
  currentInputQuantities.value = [];
};

watch(
  () => props.clearTable,
  async (newId, oldId) => {
    clearTableValues();
  }
);

const saveTableValues = () => {
  if (areQuantitiesValid()) {
    savedQuantitiesInProduct.value = [];
    const currentInputFields = Object.entries(currentInputQuantities.value);
    currentInputFields.forEach(([resourceId, quantity]) => {
      savedQuantitiesInProduct.value.push({
        id: resourceId,
        quantity: Number(quantity),
      });
    });
    emits("save-resources-dialog", savedQuantitiesInProduct.value);
  } else {
    snackbarProvider.showErrorSnackbar(
      "There needs to be at least one resource in the product contents"
    );
  }
};

const quantityMoreThanTotalQuantity = (quantity, resourceId) => {
  return (
    Number(quantity) >
    resourcesInUser.value.find((resource) => resource.id === resourceId)
      .quantity
  );
};

const areQuantitiesValid = () => {
  const currentInputFields = Object.entries(currentInputQuantities.value);
  return (
    currentInputFields.length > 0 &&
    currentInputFields.filter(([resourceId, quantity]) => {
      return (
        Number(quantity) <= 0.0 ||
        quantityMoreThanTotalQuantity(quantity, resourceId)
      );
    }).length == 0
  );
};

const closeDialog = () => {
  currentInputQuantities.value = [];
  savedQuantitiesInProduct.value.forEach(
    ({ id, quantity }) => (currentInputQuantities.value[id] = quantity)
  );
  emits("close-dialog", "resources");
};
</script>