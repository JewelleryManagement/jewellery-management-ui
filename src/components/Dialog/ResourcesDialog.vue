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
            :items="resources"
            class="elevation-1"
            :search="search"
          >
            <template v-slot:item.addQuantity="{ item }">
              <v-text-field
                variant="underlined"
                v-model="quantityByProduct[item.id]"
                type="number"
                min="0"
                :rules="usePositiveNumberRules(item.quantity)"
                :style="{
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
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
import { ref, computed } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";
const store = useStore();

const emits = defineEmits(["save-resources-dialog", "close-dialog"]);
const { inputResources } = defineProps({
  inputResources: Array,
});
const search = ref("");
const [quantityByProduct, resourcesContent] = [ref(inputResources), ref([])];
const tableColumns = [
  computed(() => store.state.resources.tableColumnAddQuantity).value,
  computed(() => store.state.resources.tableColumnQuantity).value,
  ...computed(() => store.state.resources.tableColumns).value,
];

const resources = computed(() => store.getters["users/getUserResources"]);

const clearTableValues = () => {
  quantityByProduct.value = {};
};

const saveTableValues = () => {
  if (areQuantitiesValid()) {
    resourcesContent.value = [];
    const currentInputFields = Object.entries(quantityByProduct.value);
    currentInputFields.forEach(([resourceId, quantity]) => {
      if (quantity > 0.0) {
        resourcesContent.value.push({ id: resourceId, quantity: quantity });
      }
    });

    emits("save-resources-dialog", resourcesContent.value);
  }
};

const quantityMoreThanTotalQuantity = (quantity, resourceId) => {
  return (
    quantity >
    resources.value.find((resource) => resource.id === resourceId).quantity
  );
};

const areQuantitiesValid = () => {
  const currentInputFields = Object.entries(quantityByProduct.value);
  return (
    currentInputFields.filter(([resourceId, quantity]) => {
      return (
        quantity <= 0.0 || quantityMoreThanTotalQuantity(quantity, resourceId)
      );
    }).length == 0
  );
};
const closeDialog = () => {
  resourcesContent.value.forEach(
    ({ id, quantity }) => (quantityByProduct.value[id] = quantity)
  );
  emits("close-dialog", "resources");
};
</script>
