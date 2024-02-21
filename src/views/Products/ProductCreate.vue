<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <ProductCreateAndEditForm
        :productInfo="productInfo"
        :submitReqFunction="createProduct"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import ProductCreateAndEditForm from "@/components/Form/ProductCreateAndEditForm.vue";
import {
  prepareProductsContent,
  prepareResourcesContent,
} from "@/utils/data-formatter";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();

const user = computed(() => store.getters["auth/getUser"]).value;

const pageTitle = ref(route.meta.title);
const productInfo = ref({});

const createProduct = async () => {
  const productForCreation = {
    ...productInfo.value,
    ownerId: user.id,
    authors: productInfo.value.authors.map((author) => author.id),
    productsContent: prepareProductsContent(productInfo.value.productsContent),
    resourcesContent: prepareResourcesContent(
      productInfo.value.resourcesContent
    ),
  };

  try {
    const res = await store.dispatch("products/createProduct", productForCreation);
    snackbarProvider.showSuccessSnackbar("Successfully added product!");
    return res;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
</script>
