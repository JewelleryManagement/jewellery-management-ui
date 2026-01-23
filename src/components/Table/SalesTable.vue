<template>
  <div class="my-12">
    <div class="text-center">
      <h1>{{ tableTitle }}</h1>
    </div>

    <div v-if="isSalesPage" class="d-flex justify-end">
      <table-button path="/sales/add">New Sale</table-button>
    </div>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      @click:row="rowClickHandler"
      hover
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>

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
        <IconButton
          icon="mdi-cube-outline"
          name="Products Content"
          color="black"
          @click="openProductsDialog(item.products)"
          @click.stop
        />
      </template>
      <template v-slot:item.resources="{ item }">
        <IconButton
          icon="mdi-cube"
          name="Resource Content"
          color="black"
          @click="openResouresDialog(item.resources)"
          @click.stop
        />
      </template>

      <template v-slot:item.totalPrice="{ item }">
        €{{ item.totalPrice?.toFixed(2) }}
      </template>
      <template v-slot:item.totalDiscount="{ item }">
        €{{ item.totalDiscount?.toFixed(2) }}
      </template>
      <template v-slot:item.totalDiscountedPrice="{ item }">
        €{{ item.totalDiscountedPrice?.toFixed(2) }}
      </template>
    </v-data-table>
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
import OrganizationToolTip from "../Tooltip/OrganizationToolTip.vue";
import UserToolTip from "../Tooltip/UserToolTip.vue";
import IconButton from "../Button/IconButton.vue";
import ResourceContentDialog from "../Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "../Dialog/ProductsContentDialog.vue";
import TableButton from "../Button/TableButton.vue";
import { navigateToItemDetails } from "@/utils/row-click-handler";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  headers: Array,
  items: Array,
  tableTitle: String,
});

const search = ref("");
const route = useRoute();
const router = useRouter();

const isSalesPage = computed(() => route.path === "/sales");

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

const rowClickHandler = (row, item) => {
  const saleId = item.internalItem.key;

  navigateToItemDetails(router, "Sale-Details", "saleId", saleId);
};
</script>
