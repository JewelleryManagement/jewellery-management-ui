<template>
  <v-sheet width="300" class="mx-auto">
    <v-form ref="form" @submit.prevent="handleSubmit" @keydown.enter.prevent>
      <v-text-field
        v-model="props.productInfo.catalogNumber"
        label="Catalog name"
        :rules="useTextFieldLargeRules()"
        required
      ></v-text-field>

      <v-text-field
        v-model="props.productInfo.description"
        label="Description of the product"
        :rules="useTextAreaFieldRules()"
        required
      ></v-text-field>

      <v-autocomplete
        v-model="props.productInfo.authors"
        clearable
        chips
        closable-chips
        label="Authors"
        :items="allUsers"
        :item-props="userPropsFormatter"
        multiple
        :rules="
          props.productInfo.authors
            ? [validateAuthors(props.productInfo.authors)]
            : ['Please select at least 1 author']
        "
        required
      >
      </v-autocomplete>

      <v-text-field
        class="mt-4"
        v-model="props.productInfo.salePrice"
        label="Sale price"
        :rules="useNumberFieldRules()"
        required
      ></v-text-field>

      <v-text-field
        label="Barcode..."
        v-model="props.productInfo.productionNumber"
        :rules="useTextAreaFieldRules()"
        required
      >
      </v-text-field>

      <div>
        <bar-code
          v-if="props.productInfo.productionNumber"
          :productionNumber="props.productInfo.productionNumber"
          required
        />
      </div>

      <resources-dialog
        v-if="isResourcesForUserFetched"
        v-model="resourceDialog"
        :inputResources="props.productInfo.resourcesContent"
        @save-resources-dialog="saveResourceQuantitiesToProduct"
        @close-dialog="closeDialog"
        :clearTable="clearTable"
      ></resources-dialog>

      <products-dialog
        v-model="productsDialog"
        @close-dialog="closeDialog"
        @save-product-dialog="productsTableValues"
        :userId="owner.id"
        :inputProducts="props.productInfo.productsContent"
        :currentProductId="props.productInfo.id"
        :clearTable="clearTable"
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
          <p v-if="props.productInfo.resourcesContent?.length > 0">
            Resources selected:
            {{ props.productInfo.resourcesContent?.length || 0 }}
          </p>

          <p v-if="props.productInfo.productsContent?.length > 0">
            Products selected:
            {{ props.productInfo.productsContent?.length || 0 }}
          </p>

          <p>Current price: ${{ currentPrice.toFixed(2) }}</p>
        </div>
      </div>
      <picture-button @picture-selected="handlePictureSelected" />
      <form-buttons @reset-form="resetForm" />
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import ResourcesDialog from "@/components/Dialog/ResourcesDialog.vue";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import {
  useTextFieldLargeRules,
  useNumberFieldRules,
  useTextAreaFieldRules,
  validateAuthors,
} from "@/utils/validation-rules";
import { useRoute, useRouter } from "vue-router";
import { userPropsFormatter } from "@/utils/data-formatter";
import { useStore } from "vuex";
const props = defineProps({
  productInfo: Object,
  submitReqFunction: Function,
});
const snackbarProvider = inject("snackbarProvider");
const router = useRouter();
const route = useRoute();
const store = useStore();
const [resourceDialog, productsDialog] = [ref(false), ref(false)];
let currentPrice = 0

const form = ref(null);
const selectedPicture = ref(null);
const clearTable = ref(false);
const owner = computed(() =>
  props.productInfo?.owner
    ? props.productInfo?.owner
    : store.getters["auth/getUser"]
).value;
const allUsers = computed(() => store.getters["users/allUsers"]).value;
const isResourcesForUserFetched = ref(false);

onMounted(async () => {
  isResourcesForUserFetched.value = false;
  await fetchResourcesForUser();
  isResourcesForUserFetched.value = true;
});

const fetchResourcesForUser = async () => {
  try {
    await store.dispatch("users/fetchResourcesForUser", owner.id);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch resources for user!");
  }
};

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourceDialog.value = false)
    : (productsDialog.value = false);
};

const saveResourceQuantitiesToProduct = (resourceContentValue) => {
  currentPrice = 0
  resourceContentValue.forEach(x => {
    currentPrice += x.currentResourcePrice
  });
  console.log(currentPrice);
  props.productInfo.resourcesContent = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  props.productInfo.productsContent = productsContentValue;
  closeDialog("products");
};
const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return (
    props.productInfo.resourcesContent?.length > 0 &&
    props.productInfo.productionNumber?.length > 0 &&
    valid
  );
};
const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    props.productInfo.resourcesContent = [];
    props.productInfo.productsContent = [];
    props.productInfo.authors = [];

    clearTable.value = !clearTable.value;
  }
};

const handlePictureSelected = (chosenFile) => {
  selectedPicture.value = chosenFile;
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;

  let productResponse = await props.submitReqFunction();
  await submitPicture(productResponse);

  resetForm();
  router.push("/products");
};

const isPictureValidated = () => {
  return !!selectedPicture.value;
};

const postPicture = async (id, image) => {
  try {
    await store.dispatch("products/postPicture", { productId: id, image });
    snackbarProvider.showSuccessSnackbar(
      `Successfully ${
        route.path.includes("edit") ? "edited" : "added"
      } picture and product`
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
</script>

<style lang="scss" scoped></style>
