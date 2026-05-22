<template>
  <div>
    <div class="text-center">
      <h1>{{ title }}</h1>
    </div>
    <slot name="button"> </slot>

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
      :headers="tableColumns"
      :items="allProducts"
      :search="search"
      @click:row="navigateToItemPage"
      hover
    >
      <template v-slot:item.authors="{ item }">
        <user-tool-tip
          :user="author"
          v-for="(author, index) in item.authors"
          :key="item.id"
          @click.stop
        >
          <template v-if="index < item.authors.length - 1"
            >&comma;&nbsp;</template
          >
        </user-tool-tip>
      </template>
      <template v-slot:item.partOfSale="{ item }">
        <part-of-product
          :partOfProduct="item.partOfSale"
          routerPreFix="sales"
          @click.stop
        />
      </template>

      <template v-slot:item.salePrice="{ item }">
        €{{ item.salePrice?.toFixed(2) }}
      </template>

      <template v-slot:item.contentOf="{ item }">
        <part-of-product
          :partOfProduct="item.contentOf"
          routerPreFix="products"
          @click.stop
        />
      </template>

      <template v-slot:item.resourceContent="{ item }">
        <IconButton
          icon="mdi-cube"
          name="Resource Content"
          color="black"
          @click="openDialog(item, 'resources')"
          @click.stop
        />
      </template>

      <template v-slot:item.productsContent="{ item }">
        <IconButton
          icon="mdi-cube-outline"
          name="Products Content"
          color="black"
          @click="openDialog(item, 'products')"
          @click.stop
        />
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <disassembly-button
            v-if="permissionsStore.canDisassembleProduct(item.organization.id)"
            :item="item"
            @disassembled-product="updateProductList"
          />

          <product-transfer-button
            v-if="permissionsStore.canTransferProduct(item.organization.id)"
            :product="item"
            @transferred-product="updateProductList"
          />

          <IconButton
            v-if="permissionsStore.canUpdateProduct(item.organization.id)"
            icon="mdi-pencil"
            name="Edit"
            color="green"
            :disabled="item.partOfSale"
            :routerPath="`/products/edit/${item.id}`"
          />
        </div>
      </template>

      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope || {}" />
      </template>
    </v-data-table>

    <resource-content-dialog
      v-if="isResourceDialogOpen"
      v-model="isResourceDialogOpen"
      :data="resourceDialogData"
      @close-dialog="closeDialog('resources')"
    ></resource-content-dialog>

    <products-content-dialog
      v-if="isProductsDialogOpen"
      v-model="isProductsDialogOpen"
      :data="productsDialogData"
      @close-dialog="closeDialog('products')"
    >
    </products-content-dialog>
  </div>
</template>

<script setup>
import { navigateToItemDetails } from "../../utils/row-click-handler.js";
import { ref, computed, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import IconButton from "../Button/IconButton.vue";
import ResourceContentDialog from "../Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "../Dialog/ProductsContentDialog.vue";
import { useProductsStore } from "@/store/products.js";
import ProductTransferButton from "../Button/ProductTransferButton.vue";
import { usePermissionsStore } from "@/store/permissions.js";

const route = useRoute();
const isEventPage = computed(() => route.path.startsWith("/system-events"));
const router = useRouter();
const props = defineProps({
  products: Array,
  additionalColumnsLeft: Array,
  additionalColumnsRight: Array,
  title: String,
});
const productsStore = useProductsStore();
const permissionsStore = usePermissionsStore();

const { products, additionalColumnsLeft, additionalColumnsRight } =
  toRefs(props);

const tableColumns = computed(() => {
  const leftColumns = additionalColumnsLeft.value || [];
  const rightColumns = additionalColumnsRight.value || [];
  const defaultColumns = productsStore.getColumns;

  return [...leftColumns, ...defaultColumns, ...rightColumns];
});

const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const search = ref("");

const allProducts = computed(() => products.value ?? productsStore.products);

const productOrganizationIds = computed(() => [
  ...new Set(
    allProducts.value
      .map((product) => product.organization?.id)
      .filter(Boolean),
  ),
]);

watch(
  productOrganizationIds,
  async (organizationIds) => {
    await permissionsStore.fetchPermissionsForOrganizations(organizationIds);
  },
  { immediate: true },
);

const openDialog = (item, content) => {
  if (content == "resources") {
    resourceDialogData.value = item;
    isResourceDialogOpen.value = true;
  } else {
    productsDialogData.value = item;
    isProductsDialogOpen.value = true;
  }
};

const closeDialog = (content) => {
  if (content === "resources") {
    isResourceDialogOpen.value = false;
  } else {
    isProductsDialogOpen.value = false;
  }
};
const navigateToItemPage = (row, item) => {
  if (isEventPage.value) return;
  const productId = item.internalItem.key;

  navigateToItemDetails(router, "Product Details", "id", productId);
};

const updateProductList = async (productId) => {
  await productsStore.fetchProducts();
};
</script>

<style scoped></style>
