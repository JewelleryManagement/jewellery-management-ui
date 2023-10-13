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
          <products-table></products-table>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="green" variant="text" @click="isActive.value = false"
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

const { modelValue } = defineProps({
    modelValue: Boolean,
});

const emits = defineEmits(["close-dialog"]);
</script>
