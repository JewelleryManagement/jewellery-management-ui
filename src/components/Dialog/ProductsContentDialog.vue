<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar color="green" title="Products Content..."></v-toolbar>
        <products-table 
        :tableColumnsWithRCandPC="tableColumnsProducts"
        :propsProducts="productsContent"
        ></products-table>

        <v-card-actions class="justify-end">
          <v-btn color="red" variant="text" @click="() => $emit('close-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed} from "vue";
const store = useStore()
const tableColumnsProducts = computed(
  () => store.getters["products/getColumnsWithRCandPC"]
);
import ProductsTable from "../Table/ProductsTable.vue";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});
const productsContent = ref(data.productsContent);
</script>
