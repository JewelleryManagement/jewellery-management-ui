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
        <return-product-button :currentProductInfo="item" />
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
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const saleId = route.params.saleId;

const tableColumnsResources = computed(
  () => store.getters["sales/getResourceColumns"],
);

const currentSale = computed(() => store.getters["sales/getSaleById"](saleId));
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
  store.state.products.tableColumnOrganization,
  store.state.products.tableColumnOwner,
  store.state.sales.tableColumnReturn,
]);

const selectedButton = ref(null);

const tableButtons = computed(() => store.getters["sales/getTableButtons"]);

const events = await store.dispatch("systemEvents/getEventsRelatedTo", saleId);

const eventHeaders = computed(
  () => store.getters["systemEvents/getEventHeaders"],
);
</script>

<style lang="scss" scoped></style>
