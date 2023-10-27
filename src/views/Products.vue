<template>
  <v-container class="my-12" fluid>
    <v-row justify="center">
      <v-col cols="10" max-width="1600">
        <v-card class="elevation-12">
          <div class="text-center">
            <h1>Products table</h1>
          </div>

          <div class="d-flex justify-end">
            <v-btn
              class="mx-4"
              rounded="xs"
              :size="isSmallScreen ? 'small' : 'x-large'"
              color="red"
              to="/products/add"
              >Add Product</v-btn
            >
          </div>

          <products-table>
            <template v-slot:item.resourceContent="{ item }">
              <v-icon @click="openDialog(item, 'resources')"
                >mdi-gesture</v-icon
              >
            </template>

            <template v-slot:item.productsContent="{ item }">
              <v-icon @click="openDialog(item, 'products')"
                >mdi-reproduction</v-icon
              >
            </template>
          </products-table>

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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onMounted, inject, computed, ref } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify/lib/framework.mjs";
const [isResourceDialogOpen, resourceDialogData] = [ref(false), ref({})];
const [isProductsDialogOpen, productsDialogData] = [ref(false), ref({})];

const store = useStore();
const snackbarProvider = inject("snackbarProvider");

onMounted(async () => {
  try {
    await store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products");
  }
});

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

const isSmallScreen = computed(() => {
  return useDisplay().smAndDown.value;
});
</script>

<style scoped></style>
