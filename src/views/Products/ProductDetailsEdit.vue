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
          <ProductCreateAndEditForm :productInfo="productInfo" />

          <!-- <resources-dialog
            v-model="resourceDialog"
            :inputResources="resourcesContent"
            @save-resources-dialog="resourcesTableValues"
            @close-dialog="closeDialog"
          ></resources-dialog>

          <products-dialog
            v-model="productsDialog"
            @close-dialog="closeDialog"
            @save-product-dialog="productsTableValues"
            :userId="user.id"
          >
          </products-dialog> -->

          <!-- <div class="d-flex flex-column">
            <div class="d-flex justify-space-between">
              <v-btn color="primary" @click="resourceDialog = true">
                Resources
              </v-btn>

              <v-btn color="primary" @click="productsDialog = true">
                Products
              </v-btn>
            </div>

            <div class="d-flex flex-column mt-4">
              <p v-if="resourcesContent.length > 0">
                Resources selected: {{ resourcesContent.length || 0 }}
              </p>

              <p v-if="productsContent.length > 0">
                Products selected: {{ productsContent.length || 0 }}
              </p>
            </div>
          </div> -->

          <form-buttons @reset-form="resetForm" />
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductCreateAndEditForm from "@/components/Form/ProductCreateAndEditForm.vue";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const productId = route.params.productId;
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
}
const pageTitle = ref(route.meta.title);
const form = ref(null);

const productInfo = ref({});

if (pageTitle.value.includes("Edit")) {
  productInfo.value = store.getters["products/getProductById"](productId);
}

const resetForm = () => {
  // if (form.value) {
  //   form.value.reset();
  //   form.value.resetValidation();
  //   resourcesContent.value = [];
  //   productsContent.value = [];
  //   authors.value = [];
  // }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return (
    productInfo.value.resourcesContent.length > 0 &&
    productInfo.value.productionNumber.length > 0 &&
    valid
  );
};

// const fillAuthorsWithExistingUsers = () => {
//   authors.value.forEach((authorName, index) => {
//     const existingAuthor = allUsers.find(
//       (user) => user.id === authorName.id
//     );
//     if (existingAuthor) {
//       authors.value[index] = existingAuthor.id;
//     }
//   });
// };

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

  // fillAuthorsWithExistingUsers();

  await submitProduct();

  // resetForm();
  router.push("/products");
};
</script>
