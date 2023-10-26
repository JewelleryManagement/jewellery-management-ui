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
              <resource-availability-table
                :tableColumns="tableColumnsResources"
                :resourceItem="resourceItemResources"
                :user="user"
              ></resource-availability-table>

              <v-card class="elevation-12 mt-4">
                <div class="text-center">
                  <h1>{{ user.name }}'s products table</h1>
                </div>

                <products-table
                  :tableColumnsWithRCandPC="tableColumnsProducts"
                  :userId="userId"
                >
                  <template v-slot:item.resourceContent="{ item }">
                    <v-btn @click="openDialog(item)">Resources Content</v-btn>
                  </template>

                  <template v-slot:item.productsContent="{ item }">
                    <v-btn>Products Content</v-btn>
                  </template>

                  <template v-slot:item.owner="{ item }">
                    <v-icon>mdi-account-circle</v-icon>
                  </template>
                </products-table>

                <resource-content-dialog
                  v-if="resourceDialog"
                  v-model="resourceDialog"
                  :data="dialogData"
                  @close-dialog="closeDialog"
                ></resource-content-dialog>
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
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import ResourceContentDialog from "@/components/Dialog/ResourceContentDialog.vue";
import UserCard from "@/components/Card/UserCard.vue";
const resourceDialog = ref(false);
const dialogData = ref({});

const { id } = defineProps(["id"]);
const userId = id;
const store = useStore();
const snackbarProvider = inject("snackbarProvider");
try {
  await store.dispatch("users/fetchResourcesForUser", userId);
} catch (error) {
  snackbarProvider.showErrorSnackbar("Failed to fetch products.");
}
const tableColumnsResources = computed(() => store.getters["users/getColumns"]);
const resourceItemResources = computed(
  () => store.getters["users/getUserResources"]
);
const user = computed(() => store.getters["users/getUserById"](userId)).value;

const tableColumnsProducts = computed(
  () => store.getters["products/getColumnsWithRCandPC"]
);

const openDialog = (item) => {
  dialogData.value = item;
  resourceDialog.value = true;
};

const closeDialog = () => {
  resourceDialog.value = false;
};
</script>

<style scoped></style>
