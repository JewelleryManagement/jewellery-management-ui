<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-select
          label="Seller"
          v-model="sellerName"
          :items="allUsers"
          :item-props="userPropsFormatter"
          :rules="[validateAuthors(sellerName)]"
        >
        </v-select>

        <v-select
          v-model="buyerName"
          label="Buyer"
          :items="allUsers"
          :item-props="userPropsFormatter"
          :rules="[validateAuthors(buyerName)]"
        >
        </v-select>

        <v-container class="d-flex flex-column">
          <v-btn
            color="green lighten-1"
            @click="() => (calendarDialog = true)"
            :disabled="!selectedUser"
            >Calendar</v-btn
          >

          <p v-if="formattedDate.length > 0" class="mt-2 mx-auto text-center">
            Selected date: {{ formattedDate }}
          </p>

          <v-btn
            class="mt-2"
            color="primary"
            @click="toggleProductsDialog(true)"
            :disabled="!selectedUser"
          >
            Products
          </v-btn>
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

        <v-container class="d-flex flex-column mt-4">
          <p>Total amount: € {{ totalAmount.toFixed(2) || 0 }}</p>
          <p>Discounted amount: € {{ discountedAmount.toFixed(2) || 0 }}</p>
          <p>Total discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
        </v-container>

        <form-buttons @reset-form="resetForm" />
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

    <calendar-dialog
      v-model="calendarDialog"
      @close-dialog="handleCloseCalendar"
    />
  </v-container>
</template>

<script setup>
import { userPropsFormatter } from "@/utils/data-formatter.js";
import CalendarDialog from "@/components/Dialog/CalendarDialog.vue";
import ProductPriceDiscountRow from "@/components/ProductPriceDiscountRow.vue";
import { validateAuthors } from "@/utils/validation-rules";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch, inject } from "vue";
const snackbarProvider = inject("snackbarProvider");
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const [sellerName, buyerName] = [ref(""), ref("")];
const form = ref(null);
const selectedUser = ref("");
const [productsDialog, productsForSale] = [ref(false), ref([])];
const calendarDialog = ref(false);
const formattedDate = ref("");

const allUsers = computed(() => store.getters["users/allUsers"]).value;

watch(sellerName, (newValue) => {
  selectedUser.value = allUsers.find((user) => user.id == sellerName.value.id);
  productsForSale.value = [];
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

const toggleProductsDialog = (isOpen) => {
  productsDialog.value = isOpen;
};

function handleCloseCalendar(selectedDate) {
  calendarDialog.value = false;
  if (!selectedDate) return;
  formattedDate.value = selectedDate;
}

const setProductsForSale = (selectedProductsForSale) => {
  productsForSale.value = selectedProductsForSale.map((product) => {
    return {
      ...product,
      salePrice: product.salePrice.substring(1),
    };
  });
  toggleProductsDialog(false);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    sellerName.value = [];
    buyerName.value = [];
    productsForSale.value = [];
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
