<template>
  <v-sheet width="300" class="mx-auto">
    <OrganizationSelect
      :items="allOrgsByUser"
      :selectedValue="selectedOrg"
      @organization-changed="updateSelectedOrg"
    />
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
        label="Barcode..."
        v-model="props.productInfo.productionNumber"
        :rules="[
          (v) =>
            useBarCodeValidationRules(v).isValid ||
            useBarCodeValidationRules(v).messages,
        ]"
        required
      ></v-text-field>

      <div>
        <bar-code
          v-if="
            useBarCodeValidationRules(props.productInfo.productionNumber)
              .isValid
          "
          :productionNumber="props.productInfo.productionNumber"
          required
        />
      </div>

      <resources-dialog
        v-model="resourceDialog"
        :inputResources="props.productInfo.resourcesContent"
        :availableResources="resourcesToChooseFrom"
        @save-resources-dialog="saveResourceQuantitiesToProduct"
        @close-dialog="closeDialog"
        :clearTable="clearTable"
      ></resources-dialog>

      <products-dialog
        v-model="productsDialog"
        @close-dialog="closeDialog"
        @save-product-dialog="productsTableValues"
        :inputProducts="props.productInfo.productsContent"
        :currentProductId="props.productInfo.id"
        :clearTable="clearTable"
        :availableProducts="productsToChooseFrom"
      >
      </products-dialog>

      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between">
          <v-btn
            :disabled="!selectedOrg"
            color="primary-blue"
            @click="resourceDialog = true"
          >
            Resources
          </v-btn>

          <v-btn
            :disabled="!selectedOrg"
            color="primary-blue"
            @click="productsDialog = true"
          >
            Products
          </v-btn>
        </div>

        <v-text-field
          v-if="props.productInfo.resourcesContent?.length > 0"
          class="mt-4"
          v-model="props.productInfo.additionalPrice"
          label="Additional price"
          prefix="€"
          :rules="useAllNumberFieldRules()"
          required
        ></v-text-field>

        <ProductContentsInfoPanel
          :productInfo="props.productInfo"
          :currentResourcePrice="currentResourcePrice"
          :currentProductPrice="currentProductPrice"
          :totalPrice="totalPrice"
        />
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
import ProductContentsInfoPanel from "@/components/ProductContentsInfoPanel.vue";
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";

import {
  useTextFieldLargeRules,
  useAllNumberFieldRules,
  useTextAreaFieldRules,
  validateAuthors,
  useBarCodeValidationRules,
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
const [currentResourcePrice, currentProductPrice, totalPrice] = [
  ref(0),
  ref(0),
  computed(
    () =>
      Number(currentResourcePrice.value) +
      Number(currentProductPrice.value) +
      (Number(props.productInfo.additionalPrice) || 0)
  ),
];
const form = ref(null);
const selectedPicture = ref(null);
const clearTable = ref(false);
//TODO: remnove this owner
const owner = computed(() =>
  props.productInfo?.owner
    ? props.productInfo?.owner
    : store.getters["auth/getUser"]
).value;
const allUsers = computed(() => store.getters["users/allUsers"]).value;
// const orgUsers = ref([]);
const allOrgsByUser = ref([]);
const resourcesToChooseFrom = ref([]);
const productsToChooseFrom = ref([]);
const selectedOrg = ref(null);

const updateSelectedOrg = (newOrg) => {
  resetForm();
  props.productInfo.ownerId = newOrg.id;
  selectedOrg.value = newOrg;
  fetchResourcesForOrganization(newOrg);
  fetchProductsForOrganization(newOrg);
  // fetchUsersForOrganization(newOrg);
};

onMounted(async () => {
  calculatePricesInEditView();
  await fetchOrganizations();
});

const calculatePricesInEditView = async () => {
  if (route.path.includes("edit")) {
    const resourceContentTotal = props.productInfo.resourcesContent.reduce(
      (total, resource) => {
        return (
          total +
          Number(resource.quantity) * Number(resource.resource.pricePerQuantity)
        );
      },
      0
    );

    const productsContentTotal = props.productInfo.productsContent.reduce(
      (total, product) => {
        return total + Number(product.salePrice);
      },
      0
    );

    currentResourcePrice.value = resourceContentTotal;
    currentProductPrice.value = productsContentTotal;
  }
};
//TODO: use this when users in organization have full information
// const fetchUsersForOrganization = async (organization) => {
//   try {
//     let response = await store.dispatch(
//       "users/fetchUsersByOrganization",
//       organization.id
//     );
//     console.log(response);
//     orgUsers.value = response.members;
//   } catch (error) {
//     snackbarProvider.showErrorSnackbar("Could not fetch users!");
//   }
// };

const fetchOrganizations = async () => {
  try {
    const permission = route.path.includes("edit")
      ? "EDIT_PRODUCT"
      : "CREATE_PRODUCT";
    const response = await store.dispatch(
      "organizations/fetchUserOrgsByPermission",
      permission
    );
    allOrgsByUser.value = response;
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch organizations!");
  }
};

const fetchResourcesForOrganization = async (organization) => {
  try {
    resourcesToChooseFrom.value = await store
      .dispatch("organizations/fetchOrganizationResources", organization.id)
      .then((resourcesResponse) =>
        resourcesResponse.resourcesAndQuantities.map((resourceAndQuantity) => {
          return {
            quantity: resourceAndQuantity.quantity,
            ...resourceAndQuantity.resource,
          };
        })
      );
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch resources for organization!"
    );
  }
};
const fetchProductsForOrganization = async (organization) => {
  try {
    productsToChooseFrom.value = await store
      .dispatch("products/fetchProductsByOrganization", organization.id)
      .then((productsResponse) => {
        return productsResponse.products.filter(
          (product) =>
            !product.contentOf &&
            !product.partOfSale &&
            product.id !== props.currentProductId
        );
      });
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch products for organization!"
    );
  }
};

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourceDialog.value = false)
    : (productsDialog.value = false);
};

const saveResourceQuantitiesToProduct = (resourceContentValue) => {
  currentResourcePrice.value = 0;
  resourceContentValue.forEach((x) => {
    currentResourcePrice.value += x.currentResourcePrice;
  });

  props.productInfo.resourcesContent = resourceContentValue;
  closeDialog("resources");
};

const productsTableValues = (productsContentValue) => {
  currentProductPrice.value = 0;
  productsContentValue.forEach((product) => {
    currentProductPrice.value += Number(product.salePrice);
  });
  props.productInfo.productsContent = productsContentValue;
  closeDialog("products");
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const isResourceSelected = () => {
  if (!props.productInfo.resourcesContent?.length) {
    snackbarProvider.showErrorSnackbar("Please select at least 1 resource!");
    return false;
  }
  return true;
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
  if (!isResourceSelected()) return;

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
