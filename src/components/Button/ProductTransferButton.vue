<template>
  <IconButton
    icon="mdi-swap-horizontal"
    name="Transfer"
    color="blue"
    :disabled="!!props.product.partOfSale || !!props.product.contentOf"
    @click="openDialog"
  />

  <product-transfer-dialog
    v-if="isProductTransferDialogOpen"
    v-model="isProductTransferDialogOpen"
    :product="product"
    @close-dialog="closeDialog"
  />
</template>

<script setup>
import ProductTransferDialog from "../Dialog/ProductTransferDialog.vue";
import { ref } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps({
  product: Object,
});

const [product] = [props.product];
const isProductTransferDialogOpen = ref(false);

const openDialog = () => {
  isProductTransferDialogOpen.value = true;
};

const emits = defineEmits(["transferred-product"]);
const closeDialog = async (response) => {
  if (response === "submitted") {
    emits("transferred-product", product.id);
  }
  isProductTransferDialogOpen.value = false;
};
</script>
