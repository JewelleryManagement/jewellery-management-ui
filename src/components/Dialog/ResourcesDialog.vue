<template>
  <v-dialog
    :model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="red" title="Reasources..."></v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="tableColumns"
            :items="resources"
            class="elevation-1"
          >
            <template v-slot:item.addQuantity="{ item }">
              <v-text-field
                variant="underlined"
                v-model="quantityByProduct[item.value]"
                type="number"
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
          <v-btn color="green" variant="text" @click="saveTableValues"
            >Save</v-btn
          >
          <v-btn
            color="red"
            variant="text"
            @click="$emit('save-resources-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useStore } from "vuex";
const store = useStore();

const { modelValue } = defineProps({
  modelValue: Boolean,
});

const emits = defineEmits(["update:modelValue", "save-resources-dialog"]);
const [quantityByProduct, resourcesContent, resources] = [
  ref({}),
  ref([]),
  ref([]),
];
const tableColumns = [
  computed(() => store.state.resources.tableColumnAddQuantity).value,
  computed(() => store.state.resources.tableColumnQuantity).value,
  ...computed(() => store.state.resources.tableColumns).value,
];

const resourcesByUser = computed(() => store.getters["users/getUserResources"]);

for (let i = 0; i < resourcesByUser.value.resourcesAndQuantities.length; i++) {
  let quantity = resourcesByUser.value.resourcesAndQuantities[i].quantity;
  let resource = resourcesByUser.value.resourcesAndQuantities[i].resource;
  resource.quantity = quantity;
  resources.value.push(resource);
}

const saveTableValues = () => {
  const currentInputFields = Object.entries(quantityByProduct.value);
  currentInputFields.forEach((e) => {
    const finalInputFields = {
      resourceId: e[0],
      quantity: e[1],
    };
    resourcesContent.value.push(finalInputFields);
  });
  quantityByProduct.value = {};
  emits("save-resources-dialog", resourcesContent.value);
};
</script>
