<template>
  <v-container>
    <v-card
      class="d-flex my-14 mx-auto"
      elevation="8"
      rounded="lg"
      max-width="1000"
    >
      <v-container class="pa-0">
        <v-img
          :lazy-src="defaultPicture"
          :src="picture ?? defaultPicture"
          cover
          width="100%"
          height="100%"
        >
        </v-img>
      </v-container>

      <v-container>
        <div class="d-flex flex-column align-center">
          <div>
            <strong>Catalog Number:</strong>
            {{ currentProductInfo.catalogNumber }}
          </div>
          <div>
            <strong>Description:</strong> {{ currentProductInfo.description }}
          </div>
          <div class="d-flex">
            <strong>Owner:&nbsp;</strong
            ><user-tool-tip :user="currentProductInfo.owner" />
          </div>
          <div>
            <strong>Authors:&nbsp;</strong>
            <user-tool-tip
              :user="author"
              v-for="(author, index) in currentProductInfo.authors"
              :key="author"
              @click.stop
            >
              <template v-if="index < currentProductInfo.authors.length - 1"
                >&comma;&nbsp;</template
              >
            </user-tool-tip>
          </div>
          <div>
            <strong>Content of:</strong> {{ currentProductInfo.contentOf }}
          </div>
          <div>
            <strong>Part of sale:</strong> {{ currentProductInfo.partOfSale }}
          </div>
          <div>
            <strong>Sale price:</strong> ${{ currentProductInfo.salePrice }}
          </div>
          <div>
            <strong>Discount:</strong> {{ (currentProductInfo.discount).toFixed(2) }}%
          </div>

          <bar-code :productionNumber="currentProductInfo.productionNumber" />

          <div class="d-flex justify-center mt-10">
            <v-btn color="red" @click="openDialog('resources')" @click.stop
              >Resources</v-btn
            >
            <v-btn color="green" @click="openDialog('products')" @click.stop
              >Products</v-btn
            >
          </div>
        </div>
      </v-container>
    </v-card>

    <resource-content-dialog
      v-if="isResourceDialogOpen"
      v-model="isResourceDialogOpen"
      :data="currentProductInfo"
      @close-dialog="closeDialog('resources')"
    ></resource-content-dialog>

    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="currentProductInfo"
      @close-dialog="closeDialog('products')"
    >
    </products-content-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const isResourceDialogOpen = ref(false);
const isProductsDialogOpen = ref(false);
const defaultPicture = require("../assets/logo.png");
const store = useStore();
const route = useRoute();
const currentProductId = route.params.productId;
const currentProductInfo = computed(
  () => store.getters["products/allProducts"]
).value.find((product) => product.id === currentProductId);
console.log(currentProductInfo);
const picture =
  (await store.dispatch("products/getPicutre", currentProductId)) || null;

const openDialog = (content) => {
  if (content == "resources") {
    isResourceDialogOpen.value = true;
  } else {
    isProductsDialogOpen.value = true;
  }
};

const closeDialog = (content) => {
  if (content === "resources") {
    isResourceDialogOpen.value = false;
  } else {
    isProductsDialogOpen.value = false;
  }
};
</script>
