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


        <v-card-actions class="justify-space-between">
          <v-btn color="red" variant="text" @click="() => $emit('close-dialog')"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
const { modelValue, data } = defineProps({
  modelValue: Boolean,
  data: Object,
});
const productsContent = ref(data.productsContent);
console.log(productsContent.value);
</script>
