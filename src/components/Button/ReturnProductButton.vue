<template>
  <v-btn
    v-if="!isSalesPage && isPartOfProduct"
    color="#673AB7"
    @click.stop="submitReturn"
    :size="isMediumScreen() ? 'x-small' : 'default'"
    >Product Return</v-btn
  >
  <v-btn variant="plain" @click.stop="submitReturn" v-else-if="isSalesPage">
    <v-icon size="25">mdi-cart-remove</v-icon>
  </v-btn>
</template>

<script setup>
import { isMediumScreen } from "@/utils/display";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { inject } from "vue";
const store = useStore();
const [router, route] = [useRouter(), useRoute()];
const snackbarProvider = inject("snackbarProvider");
const isSalesPage = route.path.includes("/sales");
const isPartOfProduct = props.currentProductInfo.partOfSale;
const props = defineProps({ currentProductInfo: Object });
const currentProductId = props.currentProductInfo.id;
const submitReturn = () => {
  const confirm = window.confirm(
    "Are you sure that you would like to return this product?"
  );

  if (!confirm) return;

  submitSaleReturn();
};

const submitSaleReturn = async () => {
  try {
    await store.dispatch("sales/returnProduct", currentProductId);
    snackbarProvider.showSuccessSnackbar("Product has been returned from sale");
    isSalesPage ? router.push('/sales') : router.push('/products')
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>
