<template>
  <v-container>
    <suspense>
      <template #default>
        <v-container>
          <suspense>
            <user-card
              :name="user.firstName"
              :email="user.email"
              :resourcesAndQuantities="resourceItemResources"
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
                :resourceItem="resourceItemResources"
                :user="user"
              ></resource-availability-table>
            </base-card>
          </transition>

          <transition>
            <base-card v-if="isProductsTableVisible">
              <products-table
                :products="userProducts"
                :additionalColumnsRight="disassemblyColumns"
                :title="`${user.firstName}'s products table`"
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

                <template v-slot:item.disassembly="{ item }">
                  <disassembly-button
                    :item="item"
                    :userId="userId"
                    @click.stop
                  ></disassembly-button>
                </template>

                <template v-slot:item.transfer="{ item }">
                  <product-transfer-button :product="item" :userId="userId" />
                </template>
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
  () => router.go(route.fullPath)
);

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
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
}

async function fetchProductsForUser() {
  try {
    await store.dispatch("products/fetchProductsByOwner", userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
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
  store.state.products.tableColumnTransfer,
]);
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
