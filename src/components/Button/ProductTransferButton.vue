<template>
  <v-btn
    v-if="!item.sold && item.contentOf === 'No'"
    variant="plain"
    @click="openDialog"
  >
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <v-btn v-else variant="plain" disabled>
    <v-icon color="#607D8B" size="25">mdi-swap-horizontal</v-icon>
  </v-btn>

  <product-transfer-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :item="item"
    :userId="userId"
    @close-dialog="closeDialog"
  />
</template>

<script setup>
import ProductTransferDialog from "../Dialog/ProductTransferDialog.vue";
import { ref } from "vue";

const props = defineProps({
  item: Object,
  userId: { type: String, default: null },
});
const [item, userId] = [props.item, props.userId];
const isResourceDialogOpen = ref(false);

const openDialog = () => {
  isResourceDialogOpen.value = true;
};

const closeDialog = () => {
  isResourceDialogOpen.value = false;
};
</script>
