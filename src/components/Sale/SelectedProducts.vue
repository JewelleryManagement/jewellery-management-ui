<template>
  <v-container v-if="props.products.value?.length > 0">
    <div class="mx-auto text-center" style="font-size: 16px">
      Currently selected products:
    </div>
    <Product-price-discount-row
      v-for="(product, i) in props.products.value"
      :key="product"
      :product="props.products.value[i]"
    >
    <SaleToolTipProduct :sale-data="props.products.value" :product="product" />
    </Product-price-discount-row>
  </v-container>

  <v-container
    class="d-flex flex-column mt-4"
    v-if="props.products.value?.length > 0"
  >
    <h5>Products:</h5>
    <p>Price: € {{ totalAmount.toFixed(2) || 0 }}</p>
    <p>Discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
    <p>
      Final amount: €
      {{ discountedAmount.toFixed(2) || 0 }}
    </p>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import ProductPriceDiscountRow from "@/components/ProductPriceDiscountRow.vue";
import { SaleToolTipProduct } from "@/components";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const totalAmount = computed(() =>
  props.products.value.reduce(
    (amount, product) => amount + Number(product.salePrice),
    0
  )
);

const discountedSmallAmount = computed(() =>
  props.products.value.reduce(
    (amount, product) =>
      amount + (product.salePrice * (product.discount ?? 0)) / 100,
    0
  )
);

const discountedAmount = computed(
  () => totalAmount.value - discountedSmallAmount.value
);

const totalDiscount = computed(() => {
  const totalAmountValue = totalAmount.value;
  const discountedAmountValue = discountedAmount.value;

  if (totalAmountValue === 0 || isNaN(discountedAmountValue)) {
    return 0;
  }

  return 100 - (discountedAmountValue / totalAmountValue) * 100;
});
</script>
