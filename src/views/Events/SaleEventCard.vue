<template>
  <v-card class="mx-auto mt-10 mb-10" width="800" elevation="6">
    <EventCardTitleWithRawInfoButton
      v-model:rawDataButton="rawDataButton"
      :title="title"
    />

    <v-card-text class="text-center">
      <pre
        v-if="rawDataButton"
        class="text-left text-body-2"
        style="white-space: pre-wrap; word-break: break-word"
        >{{ JSON.stringify(sale, null, 2) }}
      </pre>

      <template v-else>
        <div v-if="date !== null" class="d-flex mb-2">
          <span class="font-weight-medium me-2">Return Date:</span>
          <span>{{ props.date }}</span>
        </div>
        <template v-for="row in saleRows" :key="row.key">
          <div v-if="!row.align && row.key in (sale || {})" class="d-flex mb-2">
            <span class="font-weight-medium me-2">{{ row.title }}:</span>

            <span v-if="row.key === 'buyer'">
              {{ sale?.buyer.firstName ?? "" }}
            </span>

            <span v-else-if="row.key === 'organizationSeller'">
              {{ sale?.organizationSeller?.name ?? "" }}
            </span>

            <span v-else>
              {{ sale?.[row.key] ?? "" }}
            </span>
          </div>
        </template>
      </template>
    </v-card-text>

    <ToggleTableButtons
      v-if="!rawDataButton"
      v-model="selectedButton"
      :buttons="eventTableButtons"
    />

    <resource-availability-table
      v-if="!rawDataButton && selectedButton === 'Resources'"
      :tableColumns="tableResourceColumns"
      :resources="normalizedResources"
      name="Resources Part Of Product"
    ></resource-availability-table>

    <products-table
      v-if="!rawDataButton && selectedButton === 'Products'"
      :products="sale.products"
      :additionalColumnsLeft="additionalProductColumns"
      title="Products Part Of Product"
    >
      <template v-slot:item.owner="{ item }">
        <user-tool-tip :user="item.owner" @click.stop />
      </template>
    </products-table>
  </v-card>
</template>
<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import EventCardTitleWithRawInfoButton from "./EventCardTitleWithRawInfoButton.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import UserToolTip from "@/components/Tooltip/UserToolTip.vue";

const props = defineProps({
  sale: Object,
  title: String,
  date: {
    type: String,
    default: null,
  },
});

const store = useStore();

const saleRows = computed(
  () => store.getters["sales/getColumnsWithOrganizationSeller"],
);

const additionalProductColumns = computed(
  () => store.getters["products/getAdditionalBaseColumns"],
);

const tableResourceColumns = computed(
  () => store.getters["sales/getResourceColumns"],
);

const rawDataButton = ref(false);

const normalizedResources = props.sale.resources.map((resource) => ({
  ...resource.resourceAndQuantity.resource,
  quantity: resource.resourceAndQuantity.quantity,
  discount: resource.discount,
  salePrice: resource.salePrice,
}));

const selectedButton = ref("");

const eventTableButtons = computed(
  () => store.getters["systemEvents/getEventTableButtons"],
);
</script>
