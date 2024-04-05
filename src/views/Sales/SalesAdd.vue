``<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <SaleInputs :sellObject="sellObject" :all-users="allUsers" />
        <SaleButtons :selected-user="selectedUser" @open-dialog="handleOpenDialog" />         

        <p v-if="formattedDate.length > 0" class="mt-2 mx-auto text-center">
          Selected date: {{ formattedDate }}
        </p>

        <SelectedResource :resources="resourceContent" />

<!-- 
        <v-container v-if="resourceContent.length > 0">
          <div class="mx-auto text-center" style="font-size: 16px">
            Currently selected resources:
          </div>
          <ResourcePriceDiscountRow
            v-for="(resource, i) in resourceContent"
            :key="resource"
            :resource="resourceContent[i]"
          />
        </v-container>

        <v-container
          class="d-flex flex-column mt-4"
          v-if="resourceContent.length > 0"
        >
          <h5>Resources:</h5>
          <p>Price: € {{ currentResourcePrice.toFixed(2) }}</p>
          <p>Discount: {{ computedResourcePrice.toFixed(2) }} %</p>
          <p>Final price: € {{ finalResourcePrice.toFixed(2) }}</p>
        </v-container>


        <v-container v-if="productsForSale.length > 0">
          <div class="mx-auto text-center" style="font-size: 16px">
            Currently selected products:
          </div>
          <Product-price-discount-row
            v-for="(product, i) in productsForSale"
            :key="product"
            :product="productsForSale[i]"
          />
        </v-container>

        <v-container
          class="d-flex flex-column mt-4"
          v-if="productsForSale.length > 0"
        >
          <h5>Products:</h5>
          <p>Price: € {{ totalAmount.toFixed(2) || 0 }}</p>
          <p>Discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
          <p>
            Final amount: €
            {{ (discountedAmount + finalResourcePrice).toFixed(2) || 0 }}
          </p>
        </v-container>

        <form-buttons @reset-form="resetForm" /> -->
      </v-form>
    </v-sheet>
    <products-dialog
      v-if="selectedUser"
      v-model="productsDialog"
      @close-dialog="toggleProductsDialog(false)"
      @save-product-dialog="setProductsForSale"
      :userId="selectedUser.id"
    >
    </products-dialog>

    <resources-dialog
      v-if="selectedUser"
      v-model="resourcesDialog"
      :inputResources="resourcesForSale"
      @close-dialog="closeDialog"
      @save-resources-dialog="saveResourceQuantitiesToProduct"
      :clearTable="clearTable"
    ></resources-dialog>

    <calendar-dialog
      v-model="calendarDialog"
      @close-dialog="handleCloseCalendar"
    />
  </v-container>
</template>

<script setup>
import CalendarDialog from "@/components/Dialog/CalendarDialog.vue";
import ProductPriceDiscountRow from "@/components/ProductPriceDiscountRow.vue";
import ResourcePriceDiscountRow from "@/components/ResourcePriceDiscountRow.vue";

import SaleInputs from "@/components/Sale/SaleInputs.vue";
import SaleButtons from '@/components/Sale/SaleButtons.vue';
import SelectedResource from '@/components/Sale/SelectedResource.vue';


import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import ResourcesDialog from "@/components/Dialog/ResourcesDialog.vue";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch, inject, reactive } from "vue";
const snackbarProvider = inject("snackbarProvider");
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const [sellerName, buyerName] = [ref(""), ref("")];
const form = ref(null);
const selectedUser = ref("");
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
  sellerName: '',
  buyerName: ''
})

watch(() => sellObject.sellerName, async (newValue) => {
  selectedUser.value = allUsers.find((user) => user.id == sellObject.sellerName.id);
  
  if (selectedUser.value) {
    const res = await store.dispatch(
      "users/fetchResourcesForUser",
      selectedUser.value.id
    );
    resourcesForSale.value = res.resourcesAndQuantities;
  }

  productsForSale.value = [];
});


const computedResourcePrice = computed(() => {
  return resourceContent.value.reduce(
    (amount, resource) =>
      amount +
      (Number(resource.currentResourcePrice) * (resource.discount ?? 0)) / 100,
    0
  );
});

const totalAmount = computed(() =>
  productsForSale.value.reduce(
    (amount, product) => amount + Number(product.salePrice),
    0
  )
);

const discountedSmallAmount = computed(() =>
  productsForSale.value.reduce(
    (amount, product) =>
      amount + (product.salePrice * (product.discount ?? 0)) / 100,
    0
  )
);

const finalResourcePrice = computed(
  () => Number(currentResourcePrice.value) - Number(computedResourcePrice.value)
);

const discountedAmount = computed(
  () => totalAmount.value - discountedSmallAmount.value
);

const totalDiscount = computed(() => {
  const totalAmountValue = totalAmount.value;
  const discountedAmountValue = discountedAmount.value;

  if (totalAmountValue === 0 || isNaN(discountedAmountValue)) {
    return 0;
  }

  return 100 - (discountedAmountValue / totalAmountValue) * 100;
});

const dialogFunctions = {
  calendar: () => calendarDialog.value = true,
  resources: () => resourcesDialog.value = true,
  products: () => productsDialog.value = true
};

const handleOpenDialog = (type) => {
  const openDialog = dialogFunctions[type];
  if (openDialog) openDialog();
  else console.error(`Unsupported dialog type: ${type}`);
};


const toggleProductsDialog = (isOpen) => {
  productsDialog.value = isOpen;
};

const toggleResourcesDialog = (isOpen) => {
  resourcesDialog.value = isOpen;
};

function handleCloseCalendar(selectedDate) {
  calendarDialog.value = false;
  if (!selectedDate) return;
  formattedDate.value = selectedDate;
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
  if (!(await isFormValid())) return;
  if (!isProductsValidated()) return;
  if (!isDateValidated()) return;

  const data = buildSaleRequestData();
  await postSale(data);
};
</script>
