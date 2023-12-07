<template>
  <div>
    <strong>Sale Details</strong>
    <div>Total Price: {{ currentSale.totalPrice }}</div>
    <div>Discount: {{ currentSale.totalDiscountedPrice }}</div>
    <div>Total Discount: {{ currentSale.totalDiscount }}</div>
  </div>
  <br />
  <div>Sale made on: {{ currentSale.date }}</div>
</template>

<script setup>
const { currentSale } = defineProps({ currentSale: Object });
</script>
