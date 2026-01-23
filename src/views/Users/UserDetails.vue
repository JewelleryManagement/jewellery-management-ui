<template>
  <v-container>
    <suspense>
      <template #default>
        <v-container>
          <suspense>
            <user-card
              :user="user"
              :resourcesAndQuantities="purchasedResources"
            ></user-card>
          </suspense>

          <div class="d-flex justify-center mt-10">
            <v-btn
              color="red"
              :size="isSmallScreen() ? 'small' : 'large'"
              @click="() => (isResourceTableVisible = !isResourceTableVisible)"
              >{{
                isResourceTableVisible ? "Hide Resources" : "Show Resources"
              }}</v-btn
            >
            <v-btn
              color="green"
              :size="isSmallScreen() ? 'small' : 'large'"
              @click="() => (isProductsTableVisible = !isProductsTableVisible)"
              >{{
                isProductsTableVisible ? "Hide Products" : "Show Products"
              }}</v-btn
            >
          </div>

          <transition>
            <base-card v-if="isResourceTableVisible">
              <resource-availability-table
                :tableColumns="tableColumnsResources"
                :resources="purchasedResources"
                :name="`${user.firstName + ' ' + user.lastName}`"
              ></resource-availability-table>
            </base-card>
          </transition>

          <transition>
            <base-card v-if="isProductsTableVisible">
              <products-table
                :products="userProducts"
                :title="`${
                  user.firstName + ' ' + user.lastName
                }'s products table`"
              >
              </products-table>
            </base-card>
          </transition>
        </v-container>
      </template>
      <template #fallback>
        <span>Loading...</span>
      </template>
    </suspense>
  </v-container>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";
import { useStore } from "vuex";
import { isSmallScreen } from "@/utils/display";
import { useRoute, useRouter } from "vue-router";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import UserCard from "@/components/Card/UserCard.vue";
const isResourceTableVisible = ref(false);
const isProductsTableVisible = ref(false);
const route = useRoute();
const router = useRouter();
watch(
  () => route.fullPath,
  () => router.go(route.fullPath),
);

const { id } = defineProps(["id"]);
const userId = id;
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
const userProducts = computed(
  () => store.getters["products/getCurrentUserProducts"] ?? [],
);

async function fetchPurhasedResourcePerUser() {
  try {
    await store.dispatch("users/fetchPurchasedResourcesPerUser", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch purchased resources.");
  }
}

async function fetchProductsForUser() {
  try {
    await store.dispatch("products/fetchProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products.");
  }
}

await fetchPurhasedResourcePerUser();
await fetchProductsForUser();

const tableColumnsResources = computed(
  () => store.getters["users/getTableColumnsWithQuantity"],
);
const purchasedResources = computed(
  () => store.getters["users/getPurchasedResources"],
);
const user = computed(() => store.getters["users/getUserById"](userId)).value;
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
