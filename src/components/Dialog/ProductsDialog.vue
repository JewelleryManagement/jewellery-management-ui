<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="green" title="Products..."></v-toolbar>
        <v-card-text>
          <products-table :userId="userId">
            <template v-slot:item.add="{ item }">
              <v-icon color="blue" @click="addProductById(item.selectable.id)"
                >mdi-plus</v-icon
              >
            </template>
          </products-table>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="green" variant="text"  @click="saveTableValues"
            >Save</v-btn
          >
          <v-btn
            color="red"
            variant="text"
            @click="() => $emit('close-dialog', 'products')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import {ref} from 'vue'
const { modelValue, userId } = defineProps({
  modelValue: Boolean,
  userId: String,
});

const productsIds = ref([])

const emits = defineEmits(["save-product-dialog", "close-dialog"]);

const addProductById = (id) => {
  productsIds.value.push(id);
};

const saveTableValues = () => {
  emits("save-product-dialog", productsIds.value);
}
</script>
