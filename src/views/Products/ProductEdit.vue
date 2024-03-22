<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>
      <ProductCreateAndEditForm
        :productInfo="productInfo"
        :submitReqFunction="updateProduct"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import {
  prepareProductsContent,
  prepareResourcesContent,
} from "@/utils/data-formatter";
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import ProductCreateAndEditForm from "@/components/Form/ProductCreateAndEditForm.vue";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const productId = route.params.productId;
const snackbarProvider = inject("snackbarProvider");

const productInfo = ref(store.getters["products/getProductById"](productId));
const pageTitle = ref(route.meta.title);

const updateProduct = async () => {
  const updatedProduct = {
    ...productInfo.value,
    ownerId: productInfo.value.owner.id,
    authors: productInfo.value.authors.map((author) => author.id),
    productsContent: prepareProductsContent(productInfo.value.productsContent),
    resourcesContent: prepareResourcesContent(
      productInfo.value.resourcesContent
    ),
  };
  delete updatedProduct.id;

  try {
    const res = await store.dispatch("products/updateProduct", {
      productId,
      updatedProduct,
    });
    snackbarProvider.showSuccessSnackbar("Successfully updated product!");
    return res;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
</script>
