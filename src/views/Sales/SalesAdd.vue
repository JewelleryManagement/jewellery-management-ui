<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <SaleInputs :sellObject="sellObject" :all-users="allUsers" />
        <SaleButtons :sellObject="sellObject" @open-dialog="handleDialogs" />

        <SaleCalendar
          :sellObject="sellObject"
          :calendarDialog="calendarDialog"
          @close-dialog="handleCloseCalendar"
        />

        <SelectedResource
          :resources="sellObject.resources"
          :allResources="resourcesForSale"
        />
        <SelectedProducts :products="sellObject.products" />
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
    <ProductsDialog
      v-if="isSellerSelected"
      v-model="productsDialog"
      @close-dialog="handleDialogs('products', false)"
      @save-product-dialog="setProductsForSale"
      :userId="sellObject.seller.id"
      :clearTable="clearTable"
      :available-products="productsForSale"
    >
    </ProductsDialog>

    <ResourcesDialog
      v-if="isSellerSelected"
      v-model="resourcesDialog"
      :availableResources="resourcesForSale"
      @close-dialog="handleDialogs('resources', false)"
      @save-resources-dialog="saveResourceQuantitiesToSale"
      :clearTable="clearTable"
    ></ResourcesDialog>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, inject, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  SaleInputs,
  SaleButtons,
  SelectedResource,
  SelectedProducts,
  SaleCalendar,
  ProductsDialog,
  ResourcesDialog,
} from "@/components";

const snackbarProvider = inject("snackbarProvider");
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const form = ref(null);
const [productsDialog, productsForSale] = [ref(false), ref([])];
const [resourcesDialog, resourcesForSale] = [ref(false), ref([])];
const calendarDialog = ref(false);
const clearTable = ref(false);

const allUsers = computed(() => store.getters["users/allUsers"]).value;

const sellObject = reactive({
  seller: {},
  buyer: {},
  products: ref([]),
  resources: ref([]),
  date: "",
});

watch(
  () => sellObject.seller,
  async (newSeller) => {
    if (newSeller) {
      resourcesForSale.value = await store
        .dispatch("organizations/fetchOrganizationResources", newSeller.id)
        .then((resourcesResponse) =>
          resourcesResponse.resourcesAndQuantities.map(
            (resourceAndQuantity) => {
              return {
                quantity: resourceAndQuantity.quantity,
                ...resourceAndQuantity.resource,
              };
            }
          )
        );

      productsForSale.value = await store
        .dispatch("products/fetchProductsByOrganization", newSeller.id)
        .then((productsResponse) => {
          return productsResponse.products.filter(
            (product) => !product.contentOf && !product.partOfSale
          );
        });
    }
  }
);

const isSellerSelected = computed(() => !!sellObject.seller?.id);

const dialogFunctions = {
  calendar: (isOpen) => (calendarDialog.value = isOpen),
  resources: (isOpen) => (resourcesDialog.value = isOpen),
  products: (isOpen) => (productsDialog.value = isOpen),
};

const handleDialogs = (type, isOpen = true) => {
  const openDialog = dialogFunctions[type];
  if (openDialog) openDialog(isOpen);
  else snackbarProvider.showErrorSnackbar(`Unsupported dialog type: ${type}`);
};

function handleCloseCalendar() {
  handleDialogs("calendar", false);
}

const setProductsForSale = (selectedProductsForSale) => {
  sellObject.products.value = selectedProductsForSale;
  handleDialogs("products", false);
};

const saveResourceQuantitiesToSale = (resourceContentValue) => {
  sellObject.resources.value = resourceContentValue.map((resource) => {
    if (resource.discount === undefined) {
      resource.discount = null;
    }
    return resource;
  });

  handleDialogs("resources", false);
};

const resetForm = () => {
  if (form.value) {
    form.value.resetValidation();
    sellObject.seller = {};
    sellObject.buyer = {};
    sellObject.products.value = [];
    sellObject.resources.value = [];
    resourcesForSale.value = [];
    sellObject.date = "";

    clearTable.value = !clearTable.value;
  }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const isProductsValidated = () => {
  const selectedProducts = sellObject.products.value;
  const selectedResources = sellObject.resources.value;

  if (!selectedProducts && !selectedResources) {
    snackbarProvider.showErrorSnackbar(
      "Please select a product or a resource!"
    );
    return false;
  }
  return true;
};

const isDateValidated = () => {
  const saleDate = sellObject.date;

  if (!saleDate) {
    snackbarProvider.showErrorSnackbar("Please select a date!");
    return false;
  }
  return true;
};

const mapSelectedProducts = () => {
  const selectedProducts = sellObject.products.value;

  if (!selectedProducts) return [];

  return sellObject.products.value.map((product) => ({
    productId: product.id,
    discount: Number(product.discount) || 0,
  }));
};

const mapSelectedResources = () => {
  const selectedResources = sellObject.resources.value;

  if (!selectedResources) return [];

  return sellObject.resources.value.map((resource) => ({
    resourceAndQuantity: {
      resourceId: resource.id,
      quantity: resource.quantity,
    },
    discount: Number(resource.discount) || 0,
  }));
};

const buildSaleRequestData = () => {
  return {
    sellerId: sellObject.seller.id,
    buyerId: sellObject.buyer.id,
    products: mapSelectedProducts(),
    resources: mapSelectedResources(),
    date: sellObject.date,
  };
};

const postSale = async (data) => {
  try {
    await store.dispatch("sales/postSale", data);
    snackbarProvider.showSuccessSnackbar("Successfully sold the product!");
    router.push("/sales");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async () => {
  if (!(await isFormValid())) return;
  if (!isDateValidated()) return;
  if (!isProductsValidated()) return;
  const data = buildSaleRequestData();
  await postSale(data);
};
</script>
