<template>
  <v-btn
    :disabled="product.sold || product.contentOf === 'Yes'"
    variant="plain"
    @click="openDialog"
    @click.stop
  >
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <product-transfer-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :product="product"
    :userId="userId"
    @close-dialog="closeDialog"
  />
</template>

<script setup>
import ProductTransferDialog from "../Dialog/ProductTransferDialog.vue";
import { ref, inject } from "vue";
const snackbarProvider = inject("snackbarProvider");
import { useStore } from "vuex";
const store = useStore();

const props = defineProps({
  product: Object,
  userId: { type: String, default: null },
});
const [product, userId] = [props.product, props.userId];
const isResourceDialogOpen = ref(false);

const openDialog = () => {
  isResourceDialogOpen.value = true;
};

const closeDialog = async (response) => {
  response === "submitted"
    ? await fetchData()
    : (isResourceDialogOpen.value = false);
};

const fetchData = async () => {
  const actionType = userId ? "products/fetchProductsByOwner" : "products/fetchProducts";
  const errorMessage = userId ? "Failed to fetch user products." : "Failed to fetch products.";

  try {
    await store.dispatch(actionType, userId);
    isResourceDialogOpen.value = false;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(errorMessage);
  }
};

</script>
