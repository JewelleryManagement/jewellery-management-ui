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
          <ProductCreateAndEditForm :productsInfo="productsInfo" />

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

          <!-- <picture-button @picture-selected="handlePictureSelected" /> -->

          <!-- <form-buttons @reset-form="resetForm" /> -->
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourcesDialog from "@/components/Dialog/ResourcesDialog.vue";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import ProductCreateAndEditForm from '@/components/Form/Products/ProductCreateAndEditForm.vue'


const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() => store.getters["users/allUsers"]).value;


try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
}
const pageTitle = ref(route.meta.title);

const [resourceDialog, productsDialog] = [ref(false), ref(false)];
const form = ref(null);

const productsInfo = ref({})

if (pageTitle.value.includes("Edit")) {
  const currentProductInfo = ref(
    store.getters["products/getProductById"](route.params.productId)
  );
  productsInfo.value = currentProductInfo.value
  // resourcesContent.value = currentProductInfo.value.resourcesContent
}

// const resetForm = () => {
//   if (form.value) {
//     form.value.reset();
//     form.value.resetValidation();
//     resourcesContent.value = [];
//     productsContent.value = [];
//     authors.value = [];
//   }
// };

// const closeDialog = (payload) => {
//   payload === "resources"
//     ? (resourceDialog.value = false)
//     : (productsDialog.value = false);
// };

// const resourcesTableValues = (resourceContentValue) => {
//   resourcesContent.value = resourceContentValue;
//   closeDialog("resources");
// };

// const productsTableValues = (productsContentValue) => {
//   productsContent.value = productsContentValue.map((product) => product.id);
//   closeDialog("products");
// };

// const isFormValid = async () => {
//   const { valid } = await form.value.validate();
//   return (
//     resourcesContent.value.length > 0 &&
//     productionNumber.value.length > 0 &&
//     valid
//   );
// };

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

// const submitProduct = async () => {
//   const product = {
//     catalogNumber: catalogNumber.value,
//     productionNumber: productionNumber.value,
//     description: description.value,
//     ownerId: user.id,
//     authors: authors.value,
//     salePrice: salePrice.value,
//     resourcesContent: resourcesContent.value,
//     productsContent: productsContent.value,
//   };
//   try {
//     const res = await store.dispatch("products/createProduct", product);
//     snackbarProvider.showSuccessSnackbar("Successfully added product!");
//     return res;
//   } catch (error) {
//     snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
//   }
//   return false;
// };

// const handlePictureSelected = (chosenFile) => {
//   selectedPicture.value = chosenFile;
// };

// const isPictureValidated = () => {
//   return !!selectedPicture.value;
// };

// const postPicture = async (id, image) => {
//   try {
//     await store.dispatch("products/postPicture", { productId: id, image });
//     snackbarProvider.showSuccessSnackbar(
//       "Successfully added product and picture!"
//     );
//   } catch (error) {
//     snackbarProvider.showErrorSnackbar(
//       "Couldn't add the picture to the product!"
//     );
//   }
// };

// async function submitPicture(productResponse) {
//   if (productResponse && isPictureValidated()) {
//     const { id } = productResponse;
//     await postPicture(id, selectedPicture.value);
//   }
// }

const handleSubmit = async () => {
  // if (!(await isFormValid())) {
  //   return;
  // }

  // fillAuthorsWithExistingUsers();

  // let productResponse = await submitProduct();
  // await submitPicture(productResponse);

  // resetForm();
  // router.push("/products");
};
</script>
