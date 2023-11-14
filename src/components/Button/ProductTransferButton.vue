<template>
  <v-btn
    :disabled="item.sold || item.contentOf === 'Yes'"
    variant="plain"
    @click="openDialog"
  >
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <product-transfer-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :product="item"
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
  item: Object,
  userId: { type: String, default: null },
});
const [item, userId] = [props.item, props.userId];
const isResourceDialogOpen = ref(false);

const openDialog = () => {
  isResourceDialogOpen.value = true;
};

const closeDialog = async (response) => {
  response === "submitted"
    ? await submittedHandler()
    : (isResourceDialogOpen.value = false);
};

const submittedHandler = async () => {
  userId ? await fetchProductsForUser() : await fetchProducts();
  isResourceDialogOpen.value = false;
};

async function fetchProducts() {
  try {
    await store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products.");
  }
}

async function fetchProductsForUser() {
  try {
    await store.dispatch("products/fetchProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch user products.");
  }
}
</script>
