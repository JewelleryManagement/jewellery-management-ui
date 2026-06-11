<template>
  <v-container fluid>
    <sale-card :current-sale="currentSale" />

    <ToggleTableButtons v-model="selectedButton" :buttons="tableButtons" />

    <resource-availability-table
      v-if="selectedButton === 'Resources'"
      :tableColumns="tableColumnsResources"
      :resources="saleResources"
      name="Current sale"
    >
      <template v-slot:item.return="{ item }">
        <return-resource-button
          v-if="
            permissionsStone.canReturnResource(
              currentSale.organizationSeller.id,
            )
          "
          :currentResourceInfo="item"
          :saleToReturnFrom="currentSale"
        />
      </template>
    </resource-availability-table>

    <products-table
      v-if="selectedButton === 'Products'"
      :products="saleProducts"
      :additionalColumnsRight="productsTableAdditionalColumns"
      title="Products in the current sale"
    >
      <template v-slot:item.owner="{ item }">
        <user-tool-tip :user="item.owner" @click.stop />
      </template>

      <template v-slot:item.return="{ item }">
        <return-product-button
          v-if="
            permissionsStone.canReturnProduct(currentSale.organizationSeller.id)
          "
          :currentProductInfo="item"
        />
      </template>
    </products-table>

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import SaleCard from "@/components/Sale/SaleCard.vue";
import UserToolTip from "@/components/Tooltip/UserToolTip.vue";
import ReturnResourceButton from "@/components/Button/ReturnResourceButton.vue";
import ReturnProductButton from "@/components/Button/ReturnProductButton.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useSalesStore } from "@/store/sales";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useProductsStore } from "@/store/products";
import { usePermissionsStore } from "@/store/permissions";

const salesStore = useSalesStore();
const systemEventsStore = useSystemEventsStore();
const productsStore = useProductsStore();
const permissionsStone = usePermissionsStore();
const route = useRoute();
const saleId = route.params.id;

const tableColumnsResources = computed(() => salesStore.getResourceColumns);

const currentSale = computed(() => salesStore.selectedSale);
const saleProducts = ref(currentSale.value.products);
const saleResources = ref(
  currentSale.value.resources.map((saleResource) => {
    return {
      ...saleResource,
      ...saleResource.resourceAndQuantity.resource,
      quantity: saleResource.resourceAndQuantity.quantity,
    };
  }),
);
const productsTableAdditionalColumns = computed(() => [
  productsStore.tableColumnOrganization,
  productsStore.tableColumnOwner,
  salesStore.tableColumnReturn,
]);

const selectedButton = ref(null);

const tableButtons = computed(() => salesStore.tableButtons);

const events = await systemEventsStore.fetchEventsRelatedTo(saleId);

const eventHeaders = computed(() => systemEventsStore.eventHeaders);

onMounted(async () => {
  await permissionsStone.fetchCurrentUserPermissions(
    currentSale.value.organizationSeller.id,
  );
});
</script>

<style lang="scss" scoped></style>
