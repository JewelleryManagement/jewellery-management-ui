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

          <v-text-field label="Barcode..." v-model="productionNumber">
          </v-text-field>

          <div>
            <vue-barcode
              v-if="productionNumber"
              :value="productionNumber"
              :options="{ displayValue: true, lineColor: '#2B2B2C' }"
            />
          </div>

          <resources-dialog
            v-model="resourceDialog"
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

            <v-btn color="success" class="mt-4" block type="submit">
              Submit
            </v-btn>

            <v-btn color="error" class="mt-4" block @click="resetForm">
              Reset
            </v-btn>

            <v-btn color="warning" class="mt-4" block @click="router.go(-1)">
              Go Back
            </v-btn>
          </div>
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
import VueBarcode from "@chenfengyuan/vue-barcode";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = computed(() =>
  store.getters["users/allUsers"].map((user) => user.name)
);

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
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

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    resourcesContent.value = [];
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
  productsContent.value = productsContentValue;
  closeDialog("products");
};

async function handleSubmit() {
  const { valid } = await form.value.validate();

  console.log(productsContent.value);
  // || productsContent.value.length <= 0
  if (resourcesContent.value.length <= 0) {
    return;
  }

  if (!valid) return;

  authors.value.forEach((authorName, index) => {
    const existingAuthor = allUsers.value.find((x) => x.name === authorName);
    if (existingAuthor) {
      authors.value[index] = existingAuthor.id;
    }
  });

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
    await store.dispatch("products/createProduct", product);
    resetForm();
    router.push("/products");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not create the product");
  }
}
</script>
