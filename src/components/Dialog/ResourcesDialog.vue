<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
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
          <v-btn color="#7986CB" variant="text" @click="clearTableValues"
            >Clear</v-btn
          >
          <v-btn color="green" variant="text" @click="saveTableValues"
            >Save</v-btn
          >
          <v-btn
            color="red"
            variant="text"
            @click="() => $emit('close-dialog', 'resources')"
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

const emits = defineEmits(["save-resources-dialog", "close-dialog"]);
const { modelValue } = defineProps({ modelValue: Boolean });
const search = ref("");

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

const clearTableValues = () => {
  for (let i = 0; i < resourcesContent.value.length; i++) {
    const element = resourcesContent.value[i].resourceId;
    quantityByProduct.value[element] = ''
  }
};

const saveTableValues = () => {
  const currentInputFields = Object.entries(quantityByProduct.value);

  currentInputFields.forEach((e) => {
    const finalInputFields = {
      resourceId: e[0],
      quantity: e[1],
    };

    const existingResource = resourcesContent.value.find(
      (r) => r.resourceId === finalInputFields.resourceId
    );

    if (existingResource) {
      if (finalInputFields.quantity == "" || finalInputFields.quantity == 0) {
        const existingResourceIndex = resourcesContent.value.findIndex(
          (r) => r.resourceId === finalInputFields.resourceId
        );

        console.log(existingResourceIndex);

        resourcesContent.value.splice(existingResourceIndex, 1)
      }

      existingResource.quantity = finalInputFields.quantity;
    } else {
      resourcesContent.value.push(finalInputFields);
    }
  });

  emits("save-resources-dialog", resourcesContent.value);
};
</script>
