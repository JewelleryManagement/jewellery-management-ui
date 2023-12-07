<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <v-card>
      <v-toolbar color="green" title="Products content..."></v-toolbar>
      <products-table :products="productsContent"> 
        <template v-slot:item.authors="{ item }">
          <user-tool-tip
            :user="author"
            v-for="(author, index) in item.authors"
            :key="item.id"
            @click.stop
          >
            <template v-if="index < item.authors.length - 1">&comma;&nbsp;</template>
          </user-tool-tip>
        </template>
      </products-table>
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
import { formatProducts } from "@/utils/data-formatter";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});

const emits = defineEmits(["close-dialog"]);

const productsContent = ref(data.productsContent);
productsContent.value = productsContent.value.map((product) => formatProducts(product));
</script>
