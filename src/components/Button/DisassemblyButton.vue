<template>
  <v-btn
    variant="plain"
    :disabled="!!props.item.contentOf || !!props.item.partOfSale"
    @click="disassmebleProduct"
  >
    <v-icon size="25">mdi-cart-off</v-icon>
  </v-btn>
</template>

<script setup>
import { useStore } from "vuex";
import { inject } from "vue";
const snackbarProvider = inject("snackbarProvider");
const props = defineProps({
  item: Object,
});

const store = useStore();

const disassmebleProduct = async () => {
  const catalogNumber = props.item.catalogNumber;
  const productId = props.item.id;
  const confirmation = window.confirm(
    `Are you sure that you would like to disassemble ${catalogNumber}?`
  );

  if (confirmation) await sendDisassembleRequest(productId);
};

const emits = defineEmits(["disassembled-product"]);
async function sendDisassembleRequest(productId) {
  try {
    await store.dispatch("products/disassmebleProduct", productId);
    emits("disassembled-product", productId);
    snackbarProvider.showSuccessSnackbar("Product disassembled successfully!");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
}
</script>
