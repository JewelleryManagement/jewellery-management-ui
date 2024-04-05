<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <SaleInputs :sellObject="sellObject" :all-users="allUsers" />
        <SaleButtons
          :selected-user="selectedUser"
          @open-dialog="handleOpenDialog"
        />
        <SaleCalendar
          :calendarDialog="calendarDialog"
          @close-dialog="handleCloseCalendar"
        />
        <SelectedResource :resources="resourceContent" />
        <SelectedProducts :products="productsForSale" />
        <form-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
    <ProductsDialog
      v-if="selectedUser.id"
      v-model="productsDialog"
      @close-dialog="toggleProductsDialog(false)"
      @save-product-dialog="setProductsForSale"
      :userId="selectedUser.id"
    >
    </ProductsDialog>

    <ResourcesDialog
      v-if="selectedUser.id"
      v-model="resourcesDialog"
      :inputResources="resourcesForSale"
      @close-dialog="closeDialog"
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
  ResourcesDialog
} from "@/components";

const snackbarProvider = inject("snackbarProvider");
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const [sellerName, buyerName] = [ref(""), ref("")];
const form = ref(null);
const selectedUser = ref({});
const [productsDialog, productsForSale] = [ref(false), ref([])];
const [
  resourcesDialog,
  resourcesForSale,
  currentResourcePrice,
  resourceContent,
] = [ref(false), ref([]), ref(0), ref([])];
const calendarDialog = ref(false);
const formattedDate = ref("");
const clearTable = ref(false);

const allUsers = computed(() => store.getters["users/allUsers"]).value;

const sellObject = reactive({
  sellerName: "",
  buyerName: "",
  date: "",
});

watch(
  () => sellObject.sellerName,
  async (newValue) => {
    selectedUser.value = allUsers.find(
      (user) => user.id == sellObject.sellerName.id
    );

    if (selectedUser.value.id) {
      const res = await store.dispatch(
        "users/fetchResourcesForUser",
        selectedUser.value.id
      );
      resourcesForSale.value = res.resourcesAndQuantities;
    }

    productsForSale.value = [];
  }
);

const dialogFunctions = {
  calendar: () => (calendarDialog.value = true),
  resources: () => (resourcesDialog.value = true),
  products: () => (productsDialog.value = true),
};

const handleOpenDialog = (type) => {
  const openDialog = dialogFunctions[type];
  if (openDialog) openDialog();
  else console.error(`Unsupported dialog type: ${type}`);
};

const toggleProductsDialog = (isOpen) => {
  productsDialog.value = isOpen;
};

function handleCloseCalendar(selectedDate) {
  calendarDialog.value = false;
  sellObject.date = selectedDate;
}

const closeDialog = (payload) => {
  payload === "resources"
    ? (resourcesDialog.value = false)
    : (productsDialog.value = false);
};

const setProductsForSale = (selectedProductsForSale) => {
  productsForSale.value = selectedProductsForSale;
  toggleProductsDialog(false);
};

const saveResourceQuantitiesToProduct = (resourceContentValue) => {
  resourceContent.value = resourceContentValue.map((resource) => {
    if (resource.discount === undefined) {
      resource.discount = null;
    }
    return resource;
  });

  currentResourcePrice.value = 0;
  resourceContent.value.forEach((x) => {
    currentResourcePrice.value += x.currentResourcePrice;
  });

  closeDialog("resources");
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    sellerName.value = [];
    buyerName.value = [];
    productsForSale.value = [];
    resourceContent.value = [];
  }
};

const isFormValid = async () => {
  const { valid } = await form.value.validate();
  return valid;
};

const isProductsValidated = () => {
  if (productsForSale.value.length <= 0) {
    snackbarProvider.showErrorSnackbar("Please select a product!");
    return false;
  }
  return true;
};

const isDateValidated = () => {
  if (formattedDate.value.length <= 0) {
    snackbarProvider.showErrorSnackbar("Please select a date!");
    return false;
  }
  return true;
};

const mapSelectedProducts = () => {
  return productsForSale.value.map((product) => ({
    productId: product.id,
    salePrice: Number(product.salePrice),
    discount: Number(product.discount) || 0,
  }));
};

const buildSaleRequestData = () => {
  return {
    sellerId: sellerName.value.id,
    buyerId: buyerName.value.id,
    products: mapSelectedProducts(),
    date: formattedDate.value,
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
  // if (!(await isFormValid())) return;
  // if (!isProductsValidated()) return;
  // if (!isDateValidated()) return;
  console.log(sellObject);
  // const data = buildSaleRequestData();
  // await postSale(data);
};
</script>
