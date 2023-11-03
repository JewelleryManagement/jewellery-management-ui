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
                    <template v-slot:item.disassembly="{ item }">
                      <v-btn
                        variant="plain"
                        :disabled="item.contentOf === 'Yes'"
                        @click="disassemblyProduct(item)"
                      >
                        <v-icon size="25">mdi-cart-off</v-icon>
                      </v-btn>
                    </template>
                  </products-table>
                </v-card>
              </transition>
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
const isResourceTableVisible = ref(false);
const isProductsTableVisible = ref(false);

const { id } = defineProps(["id"]);
const userId = id;
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const userProducts = computed(
  () => store.getters["products/getCurrentUserProducts"] ?? []
);

async function fetchResourcesForUser() {
  try {
    await store.dispatch("users/fetchResourcesForUser", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
  }
}

async function fetchProductsForUser() {
  try {
    await store.dispatch("products/fetchProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products.");
  }
}

await fetchResourcesForUser();
await fetchProductsForUser();

const tableColumnsResources = computed(() => store.getters["users/getColumns"]);
const resourceItemResources = computed(
  () => store.getters["users/getUserResources"]
);
const user = computed(() => store.getters["users/getUserById"](userId)).value;

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
    await fetchProductsForUser();
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
