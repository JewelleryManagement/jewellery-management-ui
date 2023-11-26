<template>
  <v-container>
    <v-card
      class="d-flex my-14 mx-auto"
      elevation="8"
      rounded="lg"
      max-width="1000"
    >
      <v-container
        class="pa-4 pa-md-12 d-flex flex-column d-sm-none d-md-flex"
      >
        <v-img
          class="my-4 my-md-16 mx-auto"
          min-width="300"
          src="../assets/product.jpeg"
        ></v-img>
      </v-container>

      <v-container class="mt-12 pa-4 pa-md-12 ml-sm-10 mr-sm-10">
            <div>
                <div>Catalog Number: {{ currentProductInfo.catalogNumber }}</div>
                <div>Description: {{ currentProductInfo.description }}</div>
                <div>Authors: {{ currentProductInfo.authors }}</div>
                <div>Content of: {{ currentProductInfo.contentOf }}</div>
                <div>Discount: {{ currentProductInfo.discount }}</div>
                <div>Sale price: ${{ currentProductInfo.salePrice }}</div>
                <div>Production Number: {{ currentProductInfo.productionNumber }}</div>
            </div>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const route = useRoute()
const currentProductId = route.params.productId
const currentProductInfo = computed(() => store.getters['products/allProducts']).value.find(product => product.id === currentProductId)
// const picture =  await store.dispatch('products/getPicutre',currentProductId ) || null

// console.log(picture);
</script>

