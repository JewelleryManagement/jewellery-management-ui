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
            v-model="productName"
            label="Product name"
            :rules="useTextFieldLargeRules()"
          ></v-text-field>

          <v-text-field
            v-model="description"
            label="Description of the product"
            :rules="useTextAreaFieldRules()"
          ></v-text-field>

          <v-text-field
            label="Author"
            v-model="authorInput"
            :error="authorsValidation"
            @keyup.enter="addAuthorHandler"
          >
            <template v-slot:append>
              <v-icon @click="addAuthorHandler">mdi-plus</v-icon>
            </template>
          </v-text-field>

          <div>
            <v-chip
              v-for="(author, index) in authors"
              :key="index"
              closable
              @click="removeAuthor(index)"
            >
              {{ author }}
            </v-chip>
          </div>

          <v-text-field
            class="mt-4"
            v-model="salePrice"
            label="Sale price"
            :rules="useNumberFieldRules()"
          ></v-text-field>

          <resources-dialog
            v-model="dialog"
            @save-resources-dialog="resourcesTableValues"
          ></resources-dialog>

          <v-dialog
            v-model="dialog2"
            transition="dialog-top-transition"
            width="auto"
          >
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="green" title="Products..."></v-toolbar>
                <v-card-text>
                  <products-table></products-table>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn
                    color="green"
                    variant="text"
                    @click="isActive.value = false"
                    >Save</v-btn
                  >
                  <v-btn
                    color="red"
                    variant="text"
                    @click="isActive.value = false"
                    >Close</v-btn
                  >
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between">
              <v-btn color="primary" @click="dialog = !dialog">
                Resources
              </v-btn>
              <v-btn color="primary" @click="dialog2 = true"> Products </v-btn>
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
} from "@/utils/validation-rules";

import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import ResourcesDialog from "../components/Dialog/ResourcesDialog.vue";

const props = defineProps(["VDataTable"]);
const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const user = computed(() => store.getters["auth/getUser"]).value;

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  console.log(error);
}

const [
  pageTitle,
  dialog,
  dialog2,
  form,
  productName,
  description,
  authorInput,
  authors,
  salePrice,
  authorsValidation,
  resourcesContent,
  productsContent,
] = [
  ref(route.meta.title),
  ref(false),
  ref(false),
  ref(null),
  ref(""),
  ref(""),
  ref(""),
  ref([]),
  ref(""),
  ref(false),
  ref([]),
  ref(["g28a891r-df13-40eg-9e51-ce313h52f6fi"]),
];

const addAuthorHandler = () => {
  if (authorInput.value === "") return;
  authors.value.push(authorInput.value);
  authorInput.value = "";
};

const removeAuthor = (index) => {
  authors.value.splice(index, 1);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    resourcesContent.value = [];
    authors.value = [];
    authorsValidation.value = false;
  }
};

const resourcesTableValues = (resourceContentValue) => {
  resourcesContent.value = [...resourcesContent.value, resourceContentValue];
  dialog.value = false;
};

async function handleSubmit() {
  const { valid } = await form.value.validate();

  if (authors.value.length <= 0) {
    authorsValidation.value = true;
    return;
  }

  if (resourcesContent.value.length <= 0 || productsContent.value.length <= 0) {
    return;
  }

  if (!valid) return;

  const product = {
    productName: productName.value,
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
