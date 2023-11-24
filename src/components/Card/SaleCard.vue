<template>
  <v-card class="mx-auto mt-10 text-center elevation-2" max-width="600">
    <div class="d-flex flex-sm-row flex-column justify-space-around mt-4">
      <div>
        <strong>Seller</strong>
        <div>Name: {{ currentSale.seller.name }}</div>
        <div>Email: {{ currentSale.seller.email }}</div>
      </div>
      <div>
        <strong>Buyer</strong>
        <div>Name: {{ currentSale.buyer.name }}</div>
        <div>Email: {{ currentSale.buyer.email }}</div>
      </div>
    </div>

    <br />

    <div>
      <strong>Sale Details</strong>
      <div>Total Price: {{ currentSale.totalPrice }}</div>
      <div>Discount: {{ currentSale.totalDiscountedPrice }}</div>
      <div>Total Discount: {{ currentSale.totalDiscount }}</div>
    </div>

    <br />

    <div>Sale made on: {{ currentSale.date }}</div>

    <br />
  </v-card>
</template>

<script setup>
const { currentSale } = defineProps({ currentSale: Object });
</script>
