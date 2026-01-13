<template>
  <ActionButton
    icon="mdi-cart-remove"
    name="Return"
    color="red"
    @click="submitReturn"
  />
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { inject } from "vue";
import ActionButton from "./ActionButton.vue";
const store = useStore();
const [router, route] = [useRouter(), useRoute()];
const snackbarProvider = inject("snackbarProvider");
const isSalesPage = route.path.includes("/sales");
const props = defineProps({
  currentResourceInfo: Object,
  saleToReturnFrom: Object,
});
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
