<template>
  <v-container v-if="resources.length > 0">
    <div class="mx-auto text-center" style="font-size: 16px">
      Currently selected resources:
    </div>
    <ResourcePriceDiscountRow
      v-for="(resource, index) in resources"
      :key="index"
      :resource="resource"
    />
  </v-container>
  {{ resources }}

  <v-container v-if="resources.length > 0" class="d-flex flex-column mt-4">
    <h5>Resources:</h5>
    <p>Price: € {{ currentResourcePrice.toFixed(2) }}</p>
    <p>Discount: {{ computedResourcePrice.toFixed(2) }} %</p>
    <p>Final price: € {{ finalResourcePrice.toFixed(2) }}</p>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";

import ResourcePriceDiscountRow from "@/components/ResourcePriceDiscountRow.vue";

const { resources } = defineProps({
  resources: {
    type: Array,
    required: true,
  },
});

const currentResourcePrice = computed(() =>
  resources.reduce((total, resource) => {
    console.log(resource);
    return total + resource.currentResourcePrice
  }, 0)
);


const computedResourcePrice = computed(() =>
  resources.reduce(
    (amount, resource) =>
      amount +
      (Number(resource.currentResourcePrice) * (resource.discount ?? 0)) / 100,
    0
  )
);

const finalResourcePrice = computed(
  () => Number(currentResourcePrice.value) - Number(computedResourcePrice.value)
);
</script>
