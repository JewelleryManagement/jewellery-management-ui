<template>
  <v-dialog
    :model-value="props.modelValue"
    @update:model-value="props.modelValue"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:default>
      <v-card>
        <v-toolbar color="green" title="Products..."></v-toolbar>
        <v-card-text>
          <products-table
            :products="ownedNonContentAndSoldProducts"
            :additionalColumnsLeft="addColumn"
          >
            <template v-slot:item.add="{ item }">
              <v-icon color="blue" @click="addProductById(item)">{{
                btnIcon[item.id] || ICON_ADD
              }}</v-icon>
            </template>

            <template v-slot:item.resourceContent="{ item }">
              <v-icon @click="openInnerDialog(item, 'resources')"
                >mdi-cube</v-icon
              >
            </template>

            <template v-slot:item.productsContent="{ item }">
              <v-icon @click="openInnerDialog(item, 'products')"
                >mdi-cube-outline</v-icon
              >
            </template>

            <template v-slot:item.owner="{ item }">
              <router-link
                style="text-decoration: none; color: inherit"
                :to="`/users/${item.owner.id}`"
              >
                <v-btn variant="plain">
                  <v-icon size="25">mdi-account-circle</v-icon>
                  <v-tooltip activator="parent" location="top">
                    <div>Name: {{ item.owner.name }}</div>
                    <div>Email: {{ item.owner.email }}</div>
                  </v-tooltip>
                </v-btn>
              </router-link>
            </template>
          </products-table>
        </v-card-text>

        <v-card-actions class="justify-space-between">
          <div>
            <p>
              Products selected: {{ temporarySelectedProducts.length || 0 }}
            </p>
          </div>

          <div>
            <v-btn color="#7986CB" variant="text" @click="clearTableValues"
              >Clear</v-btn
            >

            <v-btn color="green" variant="text" @click="saveTableValues"
              >Save</v-btn
            >
            <v-btn color="red" variant="text" @click="closeOuterDialog()"
              >Close</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <resource-content-dialog
    v-if="isResourceDialogOpen"
    v-model="isResourceDialogOpen"
    :data="resourceDialogData"
    @close-dialog="closeInnerDialog(dialogTypes.RESOURCE)"
  ></resource-content-dialog>

  <products-content-dialog
    v-if="isProductsDialogOpen"
    v-model="isProductsDialogOpen"
    :data="productsDialogData"
    @close-dialog="closeInnerDialog(dialogTypes.PRODUCT)"
  >
  </products-content-dialog>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { ref, computed, inject, watch } from "vue";
const snackbarProvider = inject("snackbarProvider");

import { useStore } from "vuex";
const store = useStore();
const props = defineProps({
  modelValue: Boolean,
  userId: String,
});

const ICON_ADD = ref("mdi-plus");
const ICON_REMOVE = ref("mdi-minus");
const dialogTypes = {
  RESOURCE: "resources",
  PRODUCT: "products",
};

const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

watch(
  () => props.userId,
  async (newId, oldId) => {
    await store.dispatch("products/fetchProductsByOwner", newId);
    clearTableValues();
  }
);

try {
  await store.dispatch("products/fetchProductsByOwner", props.userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}
const ownedNonContentAndSoldProducts = computed(() =>
  store.getters["products/getCurrentUserProducts"].filter(
    (product) => product.contentOf === "No" && !product.sold
  )
);

const addColumn = computed(() => [store.getters["products/getAddColumn"]]);

const savedProducts = ref([]);
const temporarySelectedProducts = ref([]);
const btnIcon = ref({});

const emits = defineEmits(["save-product-dialog", "close-dialog"]);

const openInnerDialog = (item, type) => {
  if (type == dialogTypes.RESOURCE) {
    resourceDialogData.value = item;
    isResourceDialogOpen.value = true;
  } else {
    productsDialogData.value = item;
    isProductsDialogOpen.value = true;
  }
};

const closeInnerDialog = (type) => {
  if (type === dialogTypes.RESOURCE) isResourceDialogOpen.value = false;
  if (type === dialogTypes.PRODUCT) isProductsDialogOpen.value = false;
};

const closeOuterDialog = () => {
  temporarySelectedProducts.value = [...savedProducts.value];
  btnIcon.value = [];
  savedProducts.value.forEach((product) => {
    btnIcon.value[product.id] = ICON_REMOVE;
  });
  emits("close-dialog", dialogTypes.PRODUCT);
};

const addProductById = (product) => {
  const selectedProductIndex = temporarySelectedProducts.value.findIndex(
    (existingProduct) => existingProduct.id === product.id
  );
  if (selectedProductIndex == -1) {
    temporarySelectedProducts.value.push(product);
    btnIcon.value[product.id] = ICON_REMOVE;
  } else {
    temporarySelectedProducts.value.splice(selectedProductIndex, 1);
    btnIcon.value[product.id] = ICON_ADD;
  }
};

const clearTableValues = () => {
  temporarySelectedProducts.value = [];
  btnIcon.value = {};
};

const saveTableValues = () => {
  savedProducts.value = [...temporarySelectedProducts.value];
  emits("save-product-dialog", savedProducts.value);
};
</script>
