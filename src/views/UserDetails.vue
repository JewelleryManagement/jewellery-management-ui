<template>
  <v-container>
    <suspense>
      <template #default>
        <v-container class="my-12" fluid>
          <v-row justify="center">
            <v-col cols="10" max-width="1600">
              <suspense>
                <user-card
                  :name="user.name"
                  :email="user.email"
                  :resourcesAndQuantities="resourceItemResources"
                ></user-card>
              </suspense>

              <div class="d-flex justify-center mt-10">
                <v-btn
                  color="red"
                  @click="
                    () => (isResourceTableVisible = !isResourceTableVisible)
                  "
                  >{{
                    isResourceTableVisible ? "Hide Resources" : "Show Resources"
                  }}</v-btn
                >
                <v-btn
                  color="green"
                  @click="
                    () => (isProductsTableVisible = !isProductsTableVisible)
                  "
                  >{{
                    isProductsTableVisible ? "Hide Products" : "Show Products"
                  }}</v-btn
                >
              </div>

              <transition>
                <resource-availability-table
                  v-if="isResourceTableVisible"
                  :tableColumns="tableColumnsResources"
                  :resourceItem="resourceItemResources"
                  :user="user"
                ></resource-availability-table>
              </transition>

              <transition>
                <v-card class="elevation-12 mt-4" v-if="isProductsTableVisible">
                  <div class="text-center">
                    <h1>{{ user.name }}'s products table</h1>
                  </div>

                  <products-table
                    :products="userProducts"
                    :additionalColumnsRight="disassemblyColumns"
                  >
                    <template v-slot:item.resourceContent="{ item }">
                      <v-icon @click="openDialog(item, 'resources')"
                        >mdi-cube</v-icon
                      >
                    </template>

                    <template v-slot:item.productsContent="{ item }">
                      <v-icon @click="openDialog(item, 'products')"
                        >mdi-cube-outline</v-icon
                      >
                    </template>

                    <template v-slot:item.disassembly="{ item }">
                      <v-icon @click="disassemblyProduct(item)"
                        >mdi-cart-off</v-icon
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
                </v-card>
              </transition>

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
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template #fallback>
        <span>Loading...</span>
      </template>
    </suspense>
  </v-container>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import UserCard from "@/components/Card/UserCard.vue";
const [isResourceDialogOpen, resourceDialogData, isResourceTableVisible] = [
  ref(false),
  ref({}),
  ref(false),
];
const [isProductsDialogOpen, productsDialogData, isProductsTableVisible] = [
  ref(false),
  ref({}),
  ref(false),
];

const { id } = defineProps(["id"]);
const userId = id;
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
try {
  await store.dispatch("users/fetchResourcesForUser", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
}

try {
  await store.dispatch("products/fetchProductsByOwner", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}

const userProducts = computed(
  () => store.getters["products/getCurrentUserProducts"]
);

const tableColumnsResources = computed(() => store.getters["users/getColumns"]);
const resourceItemResources = computed(
  () => store.getters["users/getUserResources"]
);
const user = computed(() => store.getters["users/getUserById"](userId)).value;

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

const disassemblyColumns = computed(() => [
  store.state.products.tableColumnDisassembly,
]);

const disassemblyProduct = async (product) => {
  const catalogNumber = product.catalogNumber;
  const productId = product.id;
  const confirmation = window.confirm(
    `Are you sure that you would like to disassemble ${catalogNumber}?`
  );

  if (confirmation) {
    await isDisassambleConfirmed(productId);
  }
};

async function isDisassambleConfirmed(productId) {
  try {
    await store.dispatch("products/disassemblyProduct", productId);
    await store.dispatch("products/fetchProducts");
    snackbarProvider.showSuccessSnackbar("Product disassembled successfully!");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Failed to disassemble product! Could be a part of another product."
    );
  }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
