<template>
  <v-card class="mx-auto mt-10 text-center elevation-2" max-width="600">
    <div class="d-flex flex-sm-row flex-column justify-space-around mt-4">
      <SaleParticipantInfo title="Seller" :participant="currentSale.seller" />
      <SaleParticipantInfo title="Buyer" :participant="currentSale.buyer" />
    </div>

    <br />

    <SaleInformation :currentSale="currentSale" />
    <v-btn
            color="#673AB7"
            @click="saleReturn"
            @click.stop
            >Sale Return</v-btn
          >
  </v-card>
</template>

<script setup>
import SaleParticipantInfo from "./SaleParticipantInfo.vue";
import SaleInformation from "./SaleInformation.vue";
import { useStore } from "vuex";
const store = useStore()
const { currentSale } = defineProps({ currentSale: Object });
console.log(currentSale);
const saleReturn = () => {
  const confirm = window.confirm('Are you sure that you would like to return this sale?')

  if (confirm) {
    try {
      store.dispatch('sales/returnSale', currentSale.id)
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
