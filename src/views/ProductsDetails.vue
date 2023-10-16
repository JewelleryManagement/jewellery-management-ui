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
            v-model="catalogName"
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
            :items="allUsers"
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

          <resources-dialog
            v-model="resourceDialog"
            @save-resources-dialog="resourcesTableValues"
            @close-dialog="closeDialog"
          ></resources-dialog>

          <products-dialog v-model="productsDialog" @close-dialog="closeDialog">
          </products-dialog>

          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between">
              <v-btn color="primary" @click="resourceDialog = true">
                Resources
              </v-btn>
              <p>Resources selected: {{ resourcesContent.length || 0 }}</p>
            </div>

            <div class="d-flex justify-space-between mt-4">
              <v-btn color="primary" @click="productsDialog = true">
                Products
              </v-btn>
              <p>Products selected: {{ productsContent.length || 0 }}</p>

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

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;
const allUsers = computed(() =>
  store.getters["users/allUsers"].map((user) => user.name)
);

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  console.log(error);
}
const pageTitle = ref(route.meta.title);
const [resourceDialog, productsDialog] = [ref(false), ref(false)];
const form = ref(null);
const [catalogName, description, salePrice] = [ref(""), ref(""), ref("")];
const authors = ref([]);

const [resourcesContent, productsContent] = [
  ref([]),
  ref(["g28a891r-df13-40eg-9e51-ce313h52f6fi"]),
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

async function handleSubmit() {
  const { valid } = await form.value.validate();

  if (resourcesContent.value.length <= 0 || productsContent.value.length <= 0) {
    return;
  }

  if (!valid) return;

  const product = {
    catalogName: catalogName.value,
    description: description.value,
    owner: user.name,
    authors: authors.value,
    salePrice: salePrice.value,
    resources: resourcesContent.value,
    products: productsContent.value,
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
