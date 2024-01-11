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

          <picture-button @picture-selected="handlePictureSelected" />
          <form-buttons @reset-form="resetForm" />
        </v-form>
      </v-sheet>
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
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();

const user = computed(() => store.getters["auth/getUser"]).value;

const clearTable = ref(false);
const productInfo = ref({});

onMounted(async () => {
  await fetchResourcesForUser();
});

const fetchResourcesForUser = async () => {
  try {
    await store.dispatch("users/fetchResourcesForUser", user.id);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
  }
};

const pageTitle = ref(route.meta.title);

const form = ref(null);
const selectedPicture = ref(null);

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
    productInfo.value.resourcesContent?.length > 0 &&
    productInfo.value.productionNumber?.length > 0 &&
    valid
  );
};

const submitProduct = async () => {
  const updatedProduct = {
    ...productInfo.value,
    ownerId: user.id,
    authors: productInfo.value.authors.map((author) => author.id),
    productsContent: prepareProductsContent(productInfo.value.productsContent),
    resourcesContent: prepareResourcesContent(
      productInfo.value.resourcesContent
    ),
  };

  try {
    const res = await store.dispatch("products/createProduct", updatedProduct);
    snackbarProvider.showSuccessSnackbar("Successfully added product!");
    return res;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};

const handlePictureSelected = (chosenFile) => {
  selectedPicture.value = chosenFile;
};

const isPictureValidated = () => {
  return !!selectedPicture.value;
};

const postPicture = async (id, image) => {
  try {
    await store.dispatch("products/postPicture", { productId: id, image });
    snackbarProvider.showSuccessSnackbar(
      "Successfully added product and picture!"
    );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Couldn't add the picture to the product!"
    );
  }
};

async function submitPicture(productResponse) {
  if (productResponse && isPictureValidated()) {
    const { id } = productResponse;
    await postPicture(id, selectedPicture.value);
  }
}

const handleSubmit = async () => {
  if (!(await isFormValid())) return;

  let productResponse = await submitProduct();
  await submitPicture(productResponse);

  resetForm();
  router.push("/products");
};
</script>
