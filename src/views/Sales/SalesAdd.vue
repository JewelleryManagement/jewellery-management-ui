<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <SaleInputs :sellObject="sellObject" :all-users="allUsers" />
        <SaleButtons
          :sellObject="sellObject"
          @open-dialog="handleDialogs"
        />

        <SaleCalendar
          :sellObject="sellObject"
          :calendarDialog="calendarDialog"
          @close-dialog="handleCloseCalendar"
        />

        <SelectedResource :resources="sellObject.resources" />
        <SelectedProducts :products="sellObject.products" />
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
    <ProductsDialog
      v-if="isSellerSelected"
      v-model="productsDialog"
      @close-dialog="handleDialogs('products', false)"
      @save-product-dialog="setProductsForSale"
      :userId="sellObject.sellerName.id"
    >
    </ProductsDialog>

    <ResourcesDialog
      v-if="isSellerSelected"
      v-model="resourcesDialog"
      :inputResources="resourcesForSale"
      @close-dialog="handleDialogs('resources', false)"
      @save-resources-dialog="saveResourceQuantitiesToProduct"
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
  sellerName: {},
  buyerName: {},
  products: ref([]),
  resources: ref([]),
  date: "",
});

watch(
  () => sellObject.sellerName,
  async (newSeller) => {
    if (newSeller) {
      const res = await store.dispatch(
        "users/fetchResourcesForUser",
        newSeller.id
      );
      resourcesForSale.value = res.resourcesAndQuantities;
    }

    productsForSale.value = [];
  }
);

const isSellerSelected = computed(() =>
  sellObject.sellerName?.id ? true : false
);

const dialogFunctions = {
  calendar: (isOpen) => (calendarDialog.value = isOpen),
  resources: (isOpen) => (resourcesDialog.value = isOpen),
  products: (isOpen) => (productsDialog.value = isOpen),
};

const handleDialogs = (type, isOpen = true) => {
  const openDialog = dialogFunctions[type];
  if (openDialog) openDialog(isOpen);
  else console.error(`Unsupported dialog type: ${type}`);
};

function handleCloseCalendar() {
  handleDialogs("calendar", false);
}

const setProductsForSale = (selectedProductsForSale) => {
  sellObject.products.value = selectedProductsForSale;
  handleDialogs("products", false);
};

const saveResourceQuantitiesToProduct = (resourceContentValue) => {
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
    // form.value.reset();
    form.value.resetValidation();
    sellObject.sellerName = "";
    sellObject.buyerName = "";
    sellObject.products.value = "";
    sellObject.resources.value = "";
    sellObject.date = "";
  }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const isProductsValidated = () => {
  if (!sellObject.products.value) {
    snackbarProvider.showErrorSnackbar("Please select a product!");
    return false;
  }
  return true;
};

const isDateValidated = () => {
  if (sellObject.date.length <= 0) {
    snackbarProvider.showErrorSnackbar("Please select a date!");
    return false;
  }
  return true;
};

const mapSelectedProducts = () => {
  return sellObject.products.value.map((product) => ({
    productId: product.id,
    salePrice: Number(product.salePrice),
    discount: Number(product.discount) || 0,
  }));
};

const mapSelectedResources = () => {
  if (sellObject.resources.length <= 0) return [];

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
    sellerId: sellObject.sellerName.id,
    buyerId: sellObject.buyerName.id,
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
  if (!isProductsValidated()) return;
  if (!isDateValidated()) return;
  console.log(sellObject);
  const data = buildSaleRequestData();
  console.log(data);
  // await postSale(data);
};
</script>
