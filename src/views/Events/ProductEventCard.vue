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
        >{{ JSON.stringify(fullEntity, null, 2) }}
      </pre>

      <template v-else>
        <template v-for="row in productRows" :key="row.key">
          <div
            v-if="!row.align && row.key in (entity || {})"
            class="d-flex mb-2"
          >
            <span class="font-weight-medium me-2">{{ row.title }}:</span>

            <span v-if="row.key === 'authors'">
              {{
                entity?.authors
                  ?.map((a) => a.firstName)
                  .filter(Boolean)
                  .join(", ") ?? ""
              }}
            </span>
            <span v-else-if="row.key === 'owner'">
              {{ entity?.owner?.firstName ?? "" }}
            </span>
            <span v-else>
              {{ entity?.[row.key] ?? "" }}
            </span>
          </div>
        </template>
        <div v-if="organization !== null" class="d-flex mb-2">
          <span class="font-weight-medium me-2">Organization:</span>
          <span>{{ props.organization?.name }}</span>
        </div>
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
      :resources="normalizeResources()"
      name="Resources Part Of Product"
    ></resource-availability-table>

    <products-table
      v-if="!rawDataButton && selectedButton === 'Products'"
      :products="entity.productsContent"
      :additionalColumnsLeft="additionalProductColumns"
      title="Products Part Of Product"
    >
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

const props = defineProps({
  entity: Object,
  organization: {
    type: Object,
    default: null,
  },
  title: String,
});

const store = useStore();

const productBaseRows = computed(() => store.getters["products/getColumns"]);

const additionalProductRows = computed(
  () => store.getters["products/getAdditionalBaseColumns"],
);

const organizationProductRow = computed(
  () => store.getters["products/getOrganizationColumn"],
);

const productRows = computed(() => [
  ...productBaseRows.value,
  ...additionalProductRows.value,
  organizationProductRow.value,
]);

const tableResourceColumns = computed(
  () => store.getters["users/getTableColumnsWithQuantity"],
);

const normalizeResources = () => {
  props.entity.resourcesContent.map(({ quantity, resource }) => ({
    ...resource,
    quantity,
  }));
};

const fullEntity = {
  product: props.entity ?? null,
  ...(props.organization && { organization: props.organization }),
};

const rawDataButton = ref(false);

const selectedButton = ref("");

const eventTableButtons = computed(
  () => store.getters["systemEvents/getEventTableButtons"],
);
</script>
