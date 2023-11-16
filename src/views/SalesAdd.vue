<template>
  <v-container>
    <v-sheet width="300" class="mx-auto">
      <div class="mx-auto text-center" style="font-size: 24px">
        {{ pageTitle }}
      </div>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-select
          label="Seller"
          v-model="seller"
          :items="allUsersNames"
          :rules="[validateAuthors(seller)]"
        >
        </v-select>

        <v-select
          v-model="buyer"
          label="Buyer"
          :items="allUsersNames"
          :rules="[validateAuthors(buyer)]"
        >
        </v-select>

        <h4
          class="mx-auto text-center"
          :style="{ visibility: isProductSelected ? 'visible' : 'hidden' }"
          style="font-size: 16px; height: 3rem; color: red"
        >
          Please select a product!
        </h4>

        <v-btn
          color="primary"
          @click="toggleDialog(true)"
          block
          :disabled="!selectedUser"
        >
          Products
        </v-btn>

        <v-container v-if="productsContent.length > 0">
          <div class="mx-auto text-center" style="font-size: 16px">
            Currently selected products:
          </div>
          <ProductRow
            v-for="(product, i) in productsContent"
            :key="product"
            :product="productsContent[i]"
          />
        </v-container>

        <v-container class="d-flex flex-column mt-4">
          <p>Total amount: € {{ totalAmount || 0 }}</p>
          <p>Discounted amount: € {{ discountedAmount || 0 }}</p>
          <p>Total discount: {{ totalDiscount.toFixed(2) || 0 }} %</p>
        </v-container>

        <submit-buttons @reset-form="resetForm" />
      </v-form>
    </v-sheet>
    <products-dialog
      v-if="selectedUser"
      v-model="productsDialog"
      @close-dialog="toggleDialog(false)"
      @save-product-dialog="productsTableValues"
      :userId="selectedUser.id"
    >
    </products-dialog>
  </v-container>
</template>

<script setup>
import ProductRow from "../components/ProductRow.vue";
import { validateAuthors } from "../utils/validation-rules";
import ProductsDialog from "@/components/Dialog/ProductsDialog.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch, inject } from "vue";
const snackbarProvider = inject("snackbarProvider");
const [route, router] = [useRoute(), useRouter()];
const store = useStore();
const pageTitle = ref(route.meta.title);
const [seller, buyer] = [ref([]), ref([])];
const [form, formValid] = [ref(null), ref(true)];
const selectedUser = ref("");
const [productsDialog, productsContent] = [ref(false), ref([])];
const isProductSelected = ref(false);

const allUsers = computed(() => store.getters["users/allUsers"]);
const allUsersNames = allUsers.value.map((user) => user.name);

watch(seller, (newValue) => {
  selectedUser.value = allUsers.value.find((user) => user.name == seller.value);
  productsContent.value = [];
});

const totalAmount = computed(() =>
  productsContent.value.reduce((acc, cur) => acc + Number(cur.salePrice), 0)
);

const discountedSmallAmount = computed(() =>
  productsContent.value.reduce(
    (acc, cur) => acc + (cur.salePrice * (cur.discount ?? 0)) / 100,
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

const toggleDialog = (isOpen) => {
  productsDialog.value = isOpen;
};

const productsTableValues = (productsContentValue) => {
  productsContent.value = productsContentValue;
  toggleDialog(false);
};

const resetForm = () => {
  if (form.value) {
    form.value.reset();
    form.value.resetValidation();
    seller.value = [];
    buyer.value = [];
    productsContent.value = [];
    isProductSelected.value = false;
  }
};

const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const handleSubmit = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;

  if (productsContent.value.length <= 0) {
    isProductSelected.value = true;
    return;
  }

  const getUserById = (username) =>
    allUsers.value.find((user) => user.name === username).id;

  const selectedSeller = getUserById(seller.value);
  const selectedBuyer = getUserById(buyer.value);

  const selectedProducts = productsContent.value.map((product) => ({
    productId: product.id,
    salePrice: Number(product.salePrice),
    discount: Number(product.discount) || 0,
  }));

  const data = {
    sellerId: selectedSeller,
    buyerId: selectedBuyer,
    products: selectedProducts,
    date: getCurrentDate(),
  };

  try {
    await store.dispatch("sales/postSale", data);
    snackbarProvider.showSuccessSnackbar("Successfully sold the product!");
    router.push("/sales");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Couldn't sale the product");
  }
};
</script>
