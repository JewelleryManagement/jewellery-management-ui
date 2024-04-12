<template>
  <v-container class="d-flex flex-row justify-center align-center ga-1">
    <v-btn
      size="small"
      color="green lighten-1"
      @click="$emit('open-dialog', 'calendar')"
      :disabled="!props.sellObject.sellerName.id || !props.sellObject.buyerName.id"
      >Calendar</v-btn
    >

    <v-btn
      size="small"
      color="primary"
      @click="$emit('open-dialog', 'products')"
      :disabled="!props.sellObject.date"
    >
      Products
    </v-btn>

    <v-btn
      size="small"
      color="#009688"
      @click="$emit('open-dialog', 'resources')"
      :disabled="!props.sellObject.date"
    >
      Resources
    </v-btn>
  </v-container>
</template>

<script setup>
const props = defineProps({
  sellObject: {
    type: Object,
    required: true,
  },
});
</script>
