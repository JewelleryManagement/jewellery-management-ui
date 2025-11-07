<template>
  <v-container class="my-12" fluid>
    <template v-slot:title>
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
    </template>
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
import { ref, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");

const store = useStore();
const route = useRoute();

const pageTitle = ref(route.meta.title);
const productInfo = ref({});

const createProduct = async () => {
  const productForCreation = {
    ...productInfo.value,
    authors: productInfo.value.authors.map((author) => author.id),
    productsContent: prepareProductsContent(productInfo.value.productsContent),
    resourcesContent: prepareResourcesContent(
      productInfo.value.resourcesContent
    ),
  };

  try {
    const res = await store.dispatch(
      "products/createProduct",
      productForCreation
    );
    snackbarProvider.showSuccessSnackbar("Successfully added product!");
    return res;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
</script>
