<template>
  <div class="my-12">
    <v-container class="my-12" fluid>
      <resource-details-card
        :resourceAvailability="resourceAvailability"
      ></resource-details-card>
    </v-container>

    <ToggleTableButtons v-model="selectedButton" :buttons="tableButtons" />

    <sales-table
      v-if="selectedButton === 'Sales'"
      :headers="salesTableColumns"
      :items="sales"
      tableTitle="Resource Sale Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getQuantityInSale(item) }}
      </template>
    </sales-table>

    <products-table
      v-if="selectedButton === 'Products'"
      :products="products"
      :additionalColumnsLeft="resourceQuantityInProductColumn"
      title="Products Containing The Resource Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getResourceQuantityInProduct(item) }}
      </template>
    </products-table>

    <organizations-table
      v-if="selectedButton === 'Organizations'"
      :headers="organizationsTableColumns"
      :items="organizations"
      name="Organizations Owning The Resource Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getOrganizationQuantity(item) }}
      </template>
    </organizations-table>

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </div>
</template>

<script setup>
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import SalesTable from "@/components/Table/SalesTable.vue";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useOrganizationsStore } from "@/store/organizations";
import { useProductsStore } from "@/store/products";
import { useSalesStore } from "@/store/sales";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useResourcesStore } from "@/store/resources";

const route = useRoute();
const productsStore = useProductsStore();
const organizationsStore = useOrganizationsStore();
const salesStore = useSalesStore();
const systemEventsStore = useSystemEventsStore();
const resourcesStore = useResourcesStore();

const resourceId = route.params.id;
const resourceAvailability = computed(() => resourcesStore.currentAvailability);

const sales = ref(await salesStore.fetchAllSalesByResource(resourceId));
const salesTableColumns = computed(() => salesStore.getAllColumnsWithQuantity);

const products = ref(
  await productsStore.fetchAllProductsByResource(resourceId),
);
const resourceQuantityInProductColumn = computed(() => [
  productsStore.tableColumnResourceQuantity,
]);

const organizations = computed(() =>
  resourceAvailability.value.organizationsAndQuantities.map((x) => x.owner),
);
const organizationsTableColumns = computed(
  () => organizationsStore.getAllColumnsWithQuantityColumn,
);

const selectedButton = ref("");

const tableButtons = computed(() => resourcesStore.tableButtons);

const getQuantityInSale = (item) => {
  return (
    item.resources?.find(
      (r) => r.resourceAndQuantity.resource.id === resourceId,
    )?.resourceAndQuantity.quantity ?? 0
  );
};

const getResourceQuantityInProduct = (item) => {
  return (
    item.resourcesContent?.find((rip) => rip.resource?.id === resourceId)
      ?.quantity ?? 0
  );
};

const getOrganizationQuantity = (item) => {
  return (
    resourceAvailability.value.organizationsAndQuantities.find(
      (x) => x.owner?.id === item.id,
    )?.quantity ?? 0
  );
};

const events = await systemEventsStore.fetchEventsRelatedTo(resourceId);

const eventHeaders = computed(() => systemEventsStore.eventHeaders);
</script>
