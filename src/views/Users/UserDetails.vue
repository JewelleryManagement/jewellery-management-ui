<template>
  <div class="my-12">
    <suspense>
      <user-card
        :user="user"
        :resourcesAndQuantities="purchasedResources"
      ></user-card>
    </suspense>

    <div class="d-flex justify-center mt-10">
      <ToggleTableButtons v-model="selectedButton" :buttons="tableButtons" />
    </div>

    <resource-availability-table
      v-if="selectedButton === 'Resources'"
      :tableColumns="tableColumnsResources"
      :resources="purchasedResources"
      :name="`${user.firstName + ' ' + user.lastName}`"
    ></resource-availability-table>

    <products-table
      v-if="selectedButton === 'Products'"
      :products="userProducts"
      :title="`${user.firstName + ' ' + user.lastName}'s products table`"
    >
    </products-table>

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import UserCard from "@/components/Card/UserCard.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import { useUsersStore } from "@/store/users";
import { useProductsStore } from "@/store/products";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useResourcesStore } from "@/store/resources";
const route = useRoute();
const router = useRouter();
watch(
  () => route.fullPath,
  () => router.go(route.fullPath),
);

const { id } = defineProps(["id"]);
const userId = id;
const productsStore = useProductsStore();
const usersStore = useUsersStore();
const systemEventsStore = useSystemEventsStore();
const resourcesStore = useResourcesStore();
const snackbarProvider = inject("snackbarProvider");
const userProducts = computed(() => productsStore.currentUserProducts ?? []);

const selectedButton = ref("");

const tableButtons = computed(() => usersStore.tableButtons);

const events = await systemEventsStore.fetchEventsRelatedTo(userId);

const eventHeaders = computed(() => systemEventsStore.eventHeaders);

async function fetchPurhasedResourcePerUser() {
  try {
    await usersStore.fetchPurchasedResourcesPerUser(userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch purchased resources.");
  }
}

async function fetchProductsForUser() {
  try {
    await productsStore.fetchProductsByOwner(userId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Failed to fetch products.");
  }
}

await fetchPurhasedResourcePerUser();
await fetchProductsForUser();

const tableColumnsResources = computed(
  () => resourcesStore.getTableColumnsWithQuantity,
);
const purchasedResources = computed(() => usersStore.getPurchasedResources);
const user = computed(() => usersStore.selectedUser);
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
