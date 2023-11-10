<template>
  <v-btn
    v-if="!item.sold && item.contentOf === 'No'"
    variant="plain"
    :to="`/products/${item.id}/transfer`"
  >
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>
  <v-btn v-else variant="plain" disabled>
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>
</template>

<script setup>
defineProps(["item"]);
</script>
