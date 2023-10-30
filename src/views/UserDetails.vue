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
                  :resourcesAndQuantities="resourceItem"
                ></user-card>
              </suspense>
              <resource-availability-table
                :tableColumns="userTableColumns"
                :resourceItem="resourceItem"
                :user="user"
              ></resource-availability-table>

              <v-card class="elevation-12 mt-4">
                <div class="text-center">
                  <h1>{{ user.name }}'s products table</h1>
                </div>

                <products-table
                  :products="userProducts"
                />
              </v-card>
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
import { computed, inject } from "vue";
import { useStore } from "vuex";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";

import UserCard from "@/components/Card/UserCard.vue";

const { id } = defineProps(["id"]);
const userId = id;
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
try {
  await store.dispatch("users/fetchResourcesForUser", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch resources.");
}
const resourceItem = computed(() => store.getters["users/getUserResources"]);

try {
  await store.dispatch("products/fetchProductsByOwner", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}
const userProducts = computed(
  () => store.getters["products/getCurrentUserProducts"]
);

const userTableColumns = computed(() => store.getters["users/getColumns"]);
const user = computed(() => store.getters["users/getUserById"](userId)).value;
</script>

<style scoped></style>
