<template>
  <v-container v-if="props.resources.value?.length > 0">
    <div class="mx-auto text-center" style="font-size: 16px">
      Currently selected resources:
    </div>
    <ResourcePriceDiscountRow
      v-for="(resource, index) in props.resources.value"
      :key="index"
      :resource="resource"
    >
      {{ resource }}
    </ResourcePriceDiscountRow>
  </v-container>

  <v-container
    v-if="props.resources.value?.length > 0"
    class="d-flex flex-column mt-4"
  >
    <h5>Resources:</h5>
    <p>Price: € {{ currentResourcePrice.toFixed(2) }}</p>
    <p>Discount: {{ computedResourcePrice.toFixed(2) }} %</p>
    <p>Final price: € {{ finalResourcePrice.toFixed(2) }}</p>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

import ResourcePriceDiscountRow from "@/components/ResourcePriceDiscountRow.vue";

const props = defineProps({
  resources: {
    type: Array,
    required: true,
  },
  allResources: { Object },
});

console.log(props.allResources);

const currentResourcePrice = computed(() =>
  props.resources.value.reduce(
    (total, resource) => total + resource.currentResourcePrice,
    0
  )
);

const computedResourcePrice = computed(() =>
  props.resources.value.reduce(
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
