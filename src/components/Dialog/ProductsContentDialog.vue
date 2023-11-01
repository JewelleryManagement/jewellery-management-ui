<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <v-card>
      <v-toolbar color="green" title="Products Content..."></v-toolbar>
      <products-table :products="productsContent"> </products-table>
      <v-card-actions class="justify-end">
        <v-btn color="red" variant="text" @click="() => $emit('close-dialog')"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import ProductsTable from "../Table/ProductsTable.vue";

const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});

const emits = defineEmits(["close-dialog"]);

const productsContent = ref(data.productsContent);
productsContent.value = productsContent.value.map((product) => ({
  ...product,
  authors: product.authors.map((a) => a.name).join(", "),
  contentOf: product.contentOf ? "Yes" : "No",
}));
</script>
