<template>
  <div>
    <sales-table>
      <template v-slot:item.seller="{ item }">
        <organization-tool-tip
          :organization="item.organizationSeller"
          @click.stop
        />
      </template>

      <template v-slot:item.buyer="{ item }">
        <user-tool-tip :user="item.buyer" @click.stop />
      </template>

      <template v-slot:item.products="{ item }">
        <v-icon @click="openProductsDialog(item.products)" @click.stop
          >mdi-cube-outline</v-icon
        >
      </template>
      <template v-slot:item.resources="{ item }">
        <v-icon @click="openResouresDialog(item.resources)" @click.stop
          >mdi-cube</v-icon
        >
      </template>
    </sales-table>
    <resource-content-dialog
      v-if="isResourceDialogOpen"
      v-model="isResourceDialogOpen"
      :data="resourceDialogData"
      @close-dialog="closeResourcesDialog()"
    ></resource-content-dialog>
    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="productsDialogData"
      @close-dialog="closeProductsDialog()"
    >
    </products-content-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SalesTable from "@/components/Table/SalesTable.vue";
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];
const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];

const openProductsDialog = (products) => {
  productsDialogData.value = {
    productsContent: products.map((product) => ({
      ...product,
    })),
  };
  isProductsDialogOpen.value = true;
};

const openResouresDialog = (resources) => {
  resourceDialogData.value = {
    resourcesContent: resources.map((resourcesSale) => ({
      ...resourcesSale.resourceAndQuantity,
    })),
  };
  isResourceDialogOpen.value = true;
};

const closeProductsDialog = () => {
  isProductsDialogOpen.value = false;
};
const closeResourcesDialog = () => {
  isResourceDialogOpen.value = false;
};
</script>
