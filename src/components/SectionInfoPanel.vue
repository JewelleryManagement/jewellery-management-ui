<template>
  <div v-if="hasSelectedResources">
    <div class="d-flex justify-space-between mt-4">
      <p>Resources selected: {{ selectedResourceCount }}</p>
      <p>Price: ${{ currentResourcePrice.toFixed(2) }}</p>
    </div>

    <div v-if="hasSelectedProducts" class="d-flex justify-space-between">
      <p>Products selected: {{ selectedProductCount }}</p>
      <p>Price: ${{ currentProductPrice.toFixed(2) }}</p>
    </div>

    <div class="d-flex justify-end mt-2">
      <p>Total Price: ${{ totalPrice.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  productInfo: Object,
  currentResourcePrice: Number,
  currentProductPrice: Number,
  totalPrice: Number
});

const hasSelectedResources = computed(
  () => props.productInfo.resourcesContent?.length > 0
);
const hasSelectedProducts = computed(
  () => props.productInfo.productsContent?.length > 0
);
const selectedResourceCount = computed(
  () => props.productInfo.resourcesContent?.length || 0
);
const selectedProductCount = computed(
  () => props.productInfo.productsContent?.length || 0
);
</script>
