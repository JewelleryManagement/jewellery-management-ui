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
import { ref, computed, toRefs } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import IconButton from "../Button/IconButton.vue";
import ResourceContentDialog from "../Dialog/ResourceContentDialog.vue";
import ProductsContentDialog from "../Dialog/ProductsContentDialog.vue";
const router = useRouter();
const props = defineProps({
  products: Array,
  additionalColumnsLeft: Array,
  additionalColumnsRight: Array,
  title: String,
});
const store = useStore();

const { products, additionalColumnsLeft, additionalColumnsRight } =
  toRefs(props);

const tableColumns = computed(() => {
  const leftColumns = additionalColumnsLeft.value || [];
  const rightColumns = additionalColumnsRight.value || [];
  const defaultColumns = store.getters["products/getColumns"];

  return [...leftColumns, ...defaultColumns, ...rightColumns];
});

const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const search = ref("");

const allProducts = computed(
  () => products.value ?? store.getters["products/allProducts"],
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
  const productId = item.internalItem.key;

  navigateToItemDetails(router, "Product Details", "productId", productId);
};
</script>

<style scoped></style>
