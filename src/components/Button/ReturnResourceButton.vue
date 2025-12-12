<template>
  <v-btn
    v-if="!isSalesPage"
    color="#673AB7"
    @click.stop="submitReturn"
    :size="isMediumScreen() ? 'x-small' : 'default'"
    >Resource Return</v-btn
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
const props = defineProps({
  currentResourceInfo: Object,
  saleToReturnFrom: Object,
});
const currentResourceId = props.currentResourceInfo.id;
const submitReturn = () => {
  const confirm = window.confirm(
    "Are you sure that you would like to return this resource?"
  );

  if (!confirm) return;

  submitSaleReturn();
};

const submitSaleReturn = async () => {
  try {
    await store.dispatch("sales/returnResource", {
      saleId: props.saleToReturnFrom.id,
      resourceId: props.currentResourceInfo.id,
    });
    snackbarProvider.showSuccessSnackbar(
      "Resource has been returned from sale"
    );
    isSalesPage ? router.push("/sales") : router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>
  