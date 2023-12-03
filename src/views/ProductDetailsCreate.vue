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
          <v-text-field
            v-model="catalogNumber"
            label="Catalog name"
            :rules="useTextFieldLargeRules()"
          ></v-text-field>

          <v-text-field
            v-model="description"
            label="Description of the product"
            :rules="useTextAreaFieldRules()"
          ></v-text-field>

          <v-autocomplete
            v-model="authors"
            clearable
            chips
            closable-chips
            label="Authors"
            :items="allUsersNames"
            multiple
            :rules="[validateAuthors(authors)]"
          >
          </v-autocomplete>

          <v-text-field
            class="mt-4"
            v-model="salePrice"
            label="Sale price"
            :rules="useNumberFieldRules()"
          ></v-text-field>

          <v-text-field
            label="Barcode..."
            v-model="productionNumber"
            :rules="useTextAreaFieldRules()"
          >
          </v-text-field>

          <div>
            <bar-code
              v-if="productionNumber"
              :productionNumber="productionNumber"
            />
          </div>

          <resources-dialog
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
          </products-dialog>

          <div class="d-flex flex-column">
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
          </div>

          <picture-button @picture-selected="handlePictureSelected" />

          <form-buttons @reset-form="resetForm" />
        </v-form>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script setup>
import {
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
  validateAuthors,
} from "@/utils/validation-rules";

import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourcesDialog from "../components/Dialog/ResourcesDialog.vue";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = computed(() =>
  store.getters["users/allUsers"].map((user) => user.firstName)
);

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
}
const pageTitle = ref(route.meta.title);
const [resourceDialog, productsDialog] = [ref(false), ref(false)];
const form = ref(null);
const [catalogNumber, description, salePrice, productionNumber] = [
  ref(""),
  ref(""),
  ref(""),
  ref(""),
];
const [authors, resourcesContent, productsContent] = [
  ref([]),
  ref([]),
  ref([]),
];
const selectedPicture = ref(null);

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    resourcesContent.value = [];
    productsContent.value = [];
    authors.value = [];
  }
};

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourceDialog.value = false)
    : (productsDialog.value = false);
};

const resourcesTableValues = (resourceContentValue) => {
  resourcesContent.value = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  productsContent.value = productsContentValue.map((product) => product.id);
  closeDialog("products");
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return (
    resourcesContent.value.length > 0 &&
    productionNumber.value.length > 0 &&
    valid
  );
};

const fillAuthorsWithExistingUsers = () => {
  authors.value.forEach((authorName, index) => {
    const existingAuthor = allUsers.value.find((x) => x.firstName === authorName);
    if (existingAuthor) {
      authors.value[index] = existingAuthor.id;
    }
  });
};

const submitProduct = async () => {
  const product = {
    catalogNumber: catalogNumber.value,
    productionNumber: productionNumber.value,
    description: description.value,
    ownerId: user.id,
    authors: authors.value,
    salePrice: salePrice.value,
    resourcesContent: resourcesContent.value,
    productsContent: productsContent.value,
  };
  try {
    const res = await store.dispatch("products/createProduct", product);
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
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error)
  }
};

async function submitPicture(productResponse) {
  if (productResponse && isPictureValidated()) {
    const { id } = productResponse;
    await postPicture(id, selectedPicture.value);
  }
}

const handleSubmit = async () => {
  if (!(await isFormValid())) {
    return;
  }

  fillAuthorsWithExistingUsers();

  let productResponse = await submitProduct();
  await submitPicture(productResponse);

  resetForm();
  router.push("/products");
};
</script>
