<template>
  <v-row class="mt-4">
    <slot></slot>
    <v-col cols="8" class="pa-0">
      <v-text-field
        prefix="€"
        :label="`Price for ${product.catalogNumber}`"
        v-model="formattedSalePrice"
        readonly
        step="0.01"
      ></v-text-field>
    </v-col>
    <v-divider vertical style="height: 3.5rem"></v-divider>
    <v-col cols="4" class="pa-0">
      <v-text-field
        suffix="%"
        label="Discount"
        v-model="formattedDiscount"
        :rules="useDiscountFieldRules()"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useDiscountFieldRules } from "@/utils/validation-rules";
const props = defineProps({ product: Object });
const formattedDiscount = computed({
  get: () => props.product?.discount ?? 0,
  set: (value) => (props.product.discount = value),
});

const formattedSalePrice = computed({
  get: () => props.product.salePrice.toFixed(2),
});
</script>
