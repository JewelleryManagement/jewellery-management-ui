<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-form ref="form" @submit.prevent="handleSubmit" @keydown.enter.prevent>
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

          <v-dialog
            v-model="dialog"
            transition="dialog-top-transition"
            width="auto"
          >
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="red" title="Reasources..."></v-toolbar>
                <v-card-text>
                  <v-data-table
                    :headers="tableColumns"
                    :items="resources"
                    class="elevation-1"
                  >
                    <template v-slot:item.addQuantity="{ item }">
                      <v-text-field
                        variant="underlined"
                        type="number"
                        v-model="quantityByProduct[item.value]"
                        :style="{
                          background: 'transparent',
                          border: 'none',
                          boxShadow: 'none',
                        }"
                      ></v-text-field>
                    </template>
                  </v-data-table>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <v-btn color="green" variant="text" @click="saveTableValues"
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
              <v-btn color="primary" @click="dialog = true"> Resources </v-btn>
              <v-btn color="primary" @click="dialog = true"> Products </v-btn>
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
const props = defineProps(["VDataTable"]);
import {
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
} from "@/utils/validation-rules";
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { VDataTable } from "vuetify/labs/VDataTable";

const store = useStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");

const tableColumns = [
  computed(() => store.state.resources.tableColumnAddQuantity).value,
  computed(() => store.state.resources.tableColumnQuantity).value,
  ...computed(() => store.state.resources.tableColumns).value,
];
const user = computed(() => store.getters["auth/getUser"]).value;

try {
  await store.dispatch("users/fetchResourcesForUser", user.id);
} catch (error) {
  console.log(error);
}

const [
  pageTitle,
  dialog,
  form,
  productName,
  description,
  authorInput,
  authors,
  salePrice,
  authorsValidation,
  quantityByProduct,
  resourcesContent,
  resources,
  productsContent,
] = [
  ref(route.meta.title),
  ref(false),
  ref(null),
  ref(""),
  ref(""),
  ref(""),
  ref([]),
  ref(""),
  ref(false),
  ref({}),
  ref([]),
  ref([]),
  ref(["g28a891r-df13-40eg-9e51-ce313h52f6fi"]),
];

const resourcesByUser = computed(() => store.getters["users/getUserResources"]);

for (let i = 0; i < resourcesByUser.value.resourcesAndQuantities.length; i++) {
  let quantity = resourcesByUser.value.resourcesAndQuantities[i].quantity;
  let resource = resourcesByUser.value.resourcesAndQuantities[i].resource;
  resource.quantity = quantity;
  resources.value.push(resource);
}

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
    authors.value = [];
    authorsValidation.value = false;
  }
};

const saveTableValues = () => {
  const currentInputFields = Object.entries(quantityByProduct.value);
  currentInputFields.forEach((e) => {
    const finalInputFields = {
      resourceId: e[0],
      quantity: e[1],
    };
    resourcesContent.value.push(finalInputFields);
  });
  quantityByProduct.value = {};
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
