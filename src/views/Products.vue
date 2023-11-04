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

          <products-table :additionalColumnsRight="disassemblyAndUserColumns">
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

            <template v-slot:item.disassembly="{ item }">
              <v-btn variant="plain" :disabled="item.contentOf === 'Yes'" @click="disassmebleProduct(item)">
                <v-icon size="25">mdi-cart-off</v-icon>
              </v-btn>
            </template>
          </products-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import { onBeforeMount, inject, computed } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify/lib/framework.mjs";
const store = useStore();
const snackbarProvider = inject("snackbarProvider");

const disassemblyAndUserColumns = computed(() => [
  store.state.products.tableColumnOwner,
  store.state.products.tableColumnDisassembly,
]);

onBeforeMount(async () => {
  try {
    await store.dispatch("products/fetchProducts");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products");
  }
});

const isSmallScreen = computed(() => {
  return useDisplay().smAndDown.value;
});

const disassmebleProduct = async (product) => {
  const catalogNumber = product.catalogNumber;
  const productId = product.id;
  const confirmation = window.confirm(
    `Are you sure that you would like to disassemble ${catalogNumber}?`
  );

  if (confirmation) {
    await sendDisassembleRequest(productId);
  }
};

async function sendDisassembleRequest(productId) {
  try {
    await store.dispatch("products/disassmebleProduct", productId);
    await store.dispatch("products/fetchProducts");
    snackbarProvider.showSuccessSnackbar("Product disassembled successfully!");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Failed to disassemble product! Could be a part of another product."
    );
  }
}
</script>
