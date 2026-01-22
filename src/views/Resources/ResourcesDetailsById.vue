<template>
  <div class="my-12">
    <v-container class="my-12" fluid>
      <resource-availability-card
        :resourceAvailability="resourceAvailability"
      ></resource-availability-card>
    </v-container>

    <ToggleTableButtons v-model="selectedButton" :buttons="buttons" />

    <sales-table
      v-if="selectedButton === buttons[0].label"
      :headers="salesTableColumns"
      :items="sales"
      tableTitle="Resource Sale Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getQuantityInSale(item) }}
      </template>
    </sales-table>

    <products-table
      v-if="selectedButton === buttons[1].label"
      :products="products"
      :additionalColumnsLeft="resourceQuantityInProductColumn"
      title="Products Containing The Resource Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getResourceQuantityInProduct(item) }}
      </template>
    </products-table>

    <organizations-table
      v-if="selectedButton === buttons[2].label"
      :headers="organizationsTableColumns"
      :items="organizations"
      name="Organizations Owning The Resource Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getOrganizationQuantity(item) }}
      </template>
    </organizations-table>
  </div>
</template>

<script setup>
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import SalesTable from "@/components/Table/SalesTable.vue";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const resourceId = route.params.id;
const resourceAvailability = ref(
  await store.dispatch("resources/fetchAvailabilityResourceById", resourceId),
);

const sales = ref(
  await store.dispatch("sales/getAllSalesByResource", resourceId),
);
const salesTableColumns = computed(
  () => store.getters["sales/getAllColumnsWithQuantity"],
);

const products = ref(
  await store.dispatch("products/getAllProductsByResource", resourceId),
);
const resourceQuantityInProductColumn = computed(
  () => store.getters["products/getResourceQuantityColumn"],
);

const organizations = computed(() =>
  resourceAvailability.value.organizationsAndQuantities.map((x) => x.owner),
);
const organizationsTableColumns = computed(
  () => store.getters["organizations/getAllColumnsWithQuantityColumn"],
);

const selectedButton = ref("");

const buttons = [
  { label: "Sales", icon: "mdi-cart-outline" },
  { label: "Products", icon: "mdi-package-variant" },
  {
    label: "Organizations",
    icon: "mdi-diamond-stone",
  },
];

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
</script>
