<template>
  <v-card class="mx-auto mt-10 text-center elevation-2" max-width="600">
    <div class="d-flex flex-sm-row flex-column justify-space-around mt-4">
      <SaleParticipantInfo title="Seller" :participant="currentSale.seller" />
      <SaleParticipantInfo title="Buyer" :participant="currentSale.buyer" />
    </div>

    <br />

    <SaleInformation :currentSale="currentSale" />
  </v-card>
</template>

<script setup>
import {SaleParticipantInfo, SaleInformation} from '@/components'

const { currentSale } = defineProps({ currentSale: Object });
</script>
