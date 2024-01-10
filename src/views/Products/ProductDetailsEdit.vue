<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-form
          ref="form"
          @submit.prevent="handleSubmit"
          @keydown.enter.prevent
        >
          <ProductCreateAndEditForm
            :productInfo="productInfo"
            :clearTable="clearTable"
          />

          <form-buttons @reset-form="resetForm" />
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductCreateAndEditForm from "@/components/Form/ProductCreateAndEditForm.vue";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const productId = route.params.productId;
const snackbarProvider = inject("snackbarProvider");
const clearTable = ref(false);

const user = computed(() => store.getters["auth/getUser"]).value;
const productInfo = ref({});
const pageTitle = ref(route.meta.title);
const form = ref(null);

onMounted(async () => {
  await fetchResourcesForUser();
});

if (pageTitle.value.includes("Edit")) {
  productInfo.value = store.getters["products/getProductById"](productId);
}

const fetchResourcesForUser = async () => {
  try {
    await store.dispatch("users/fetchResourcesForUser", user.id);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
  }
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    productInfo.value.resourcesContent = [];
    productInfo.value.productsContent = [];
    productInfo.value.authors = [];
    clearTable.value = true;

    setTimeout(() => {
      clearTable.value = false;
    }, 5000);
  }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return (
    productInfo.value.resourcesContent.length > 0 &&
    productInfo.value.productionNumber.length > 0 &&
    valid
  );
};

const prepareResourcesContent = (resourcesContent) => {
  return resourcesContent.map((resource) => ({
    id: resource.resource ? resource.resource.id : resource.id,
    quantity: resource.quantity,
  }));
};

const prepareProductsContent = (productsContent) => {
  return productsContent.map((product) => product.id);
};

const submitProduct = async () => {
  const productId = route.params.productId;
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
  console.log(updatedProduct);

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

const handleSubmit = async () => {
  if (!(await isFormValid())) {
    return;
  }

  await submitProduct();

  resetForm();
  router.push("/products");
};
</script>
