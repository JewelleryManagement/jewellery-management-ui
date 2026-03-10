<template>
  <v-container class="my-12" fluid>
    <div class="mx-auto text-center mb-6 text-h5">
      {{ pageTitle }}
    </div>
    <ProductCreateAndEditForm
      :productInfo="productInfo"
      :submitReqFunction="createProduct"
    />
  </v-container>
</template>

<script setup>
import ProductCreateAndEditForm from "@/components/Form/ProductCreateAndEditForm.vue";
import {
  prepareProductsContent,
  prepareResourcesContent,
} from "@/utils/data-formatter";
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { useProductsStore } from "@/store/products";
const snackbarProvider = inject("snackbarProvider");

const productsStore = useProductsStore();
const route = useRoute();

const pageTitle = ref(route.meta.title);
const productInfo = ref({});

const createProduct = async () => {
  const productForCreation = {
    ...productInfo.value,
    authors: productInfo.value.authors.map((author) => author.id),
    productsContent: prepareProductsContent(productInfo.value.productsContent),
    resourcesContent: prepareResourcesContent(
      productInfo.value.resourcesContent,
    ),
  };

  try {
    const res = productsStore.createProduct(productForCreation);
    snackbarProvider.showSuccessSnackbar("Successfully added product!");
    return res;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
</script>
