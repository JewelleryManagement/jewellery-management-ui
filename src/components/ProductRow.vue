<template>
    <v-row class="mt-4">
      <v-col cols="8" class="pa-0">
        <v-text-field
          prefix="€"
          label="Price"
          v-model="product.salePrice"
        ></v-text-field>
      </v-col>
      <v-divider vertical style="height: 3.5rem"></v-divider>
      <v-col cols="4" class="pa-0">
        <v-text-field
          suffix="%"
          label="Discount"
          v-model="product.discount"
        ></v-text-field>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  defineProps(['product']);
  </script>
  