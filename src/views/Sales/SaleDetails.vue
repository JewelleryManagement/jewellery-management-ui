<template>
  <v-container fluid>
    <sale-card :current-sale="currentSale" />
    <base-card>
      <resource-availability-table
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
    </base-card>
    <base-card>
      <products-table
        :products="saleProducts"
        :additionalColumnsRight="productsTableAdditionalColumns"
        title="Products in the current sale"
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

        <template v-slot:item.owner="{ item }">
          <user-tool-tip :user="item.owner" @click.stop />
        </template>

        <template v-slot:item.return="{ item }">
          <return-product-button :currentProductInfo="item" />
        </template>
      </products-table>
    </base-card>
  </v-container>
</template>

<script setup>
import ProductsTable from "@/components/Table/ProductsTable.vue";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import SaleCard from "@/components/Sale/SaleCard.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const saleId = route.params.saleId;

const tableColumnsResources = computed(
  () => store.getters["sales/getResourceColumns"]
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
  })
);
const productsTableAdditionalColumns = computed(() => [
  store.state.products.tableColumnOrganization,
  store.state.products.tableColumnOwner,
  store.state.sales.tableColumnReturn,
]);
</script>

<style lang="scss" scoped></style>
