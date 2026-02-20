<template>
  <div class="d-flex" v-if="isSimpleEntity(entityType)">
    <SimpleEntityEventCard
      :entity="event.payload.entityBefore"
      :rows="rows"
      title="Entity Before"
    />

    <SimpleEntityEventCard
      :entity="event.payload.entityAfter"
      :rows="rows"
      title="Entity After"
    />
  </div>

  <div class="d-flex" v-if="entityType === 'Product'">
    <ProductEventCard
      :entity="event.payload.entityBefore.products[0]"
      :organization="event.payload.entityBefore.organization"
      title="Entity Before"
    />

    <ProductEventCard
      :entity="event.payload.entityAfter.products[0]"
      :organization="event.payload.entityAfter.organization"
      title="Entity After"
    />
  </div>

  <div class="d-flex" v-if="entityType === 'UserInOrganization'">
    <UserInOrganizationEventCard
      :entity="event.payload.entityBefore"
      title="Entity Before"
    />

    <UserInOrganizationEventCard
      :entity="event.payload.entityAfter"
      title="Entity After"
    />
  </div>

  <div class="d-flex" v-if="entityType === 'ResourceQuantity'">
    <ResourceQuantityEventCard
      v-if="event.payload.entityBefore != null"
      :entity="event.payload.entityBefore"
      title="Entity Before"
    />

    <ResourceQuantityEventCard
      :entity="event.payload.entityAfter"
      title="Entity After"
    />
  </div>

  <div class="d-flex" v-if="entityType === 'ReturnProduct'">
    <ProductEventCard
      :entity="event.payload.entity.returnedProduct"
      title="Returned Product"
    />

    <SaleEventCard
      v-if="event.payload.entity.saleAfter !== null"
      :sale="event.payload.entity.saleAfter"
      title="Entity After"
      :date="event.payload.entity.date"
    />
  </div>

  <div class="d-flex" v-if="entityType === 'ReturnResource'">
    <SimpleEntityEventCard
      :entity="event.payload.entity.returnedResource"
      title="Returned Resource"
      :rows="rows"
    />

    <SaleEventCard
      :sale="event.payload.entity.saleAfter"
      title="Entity After"
      :date="event.payload.entity.date"
    />
  </div>
</template>

<script setup>
import ProductEventCard from "./ProductEventCard.vue";
import UserInOrganizationEventCard from "./UserInOrganizationEventCard.vue";
import ResourceQuantityEventCard from "./ResourceQuantityEventCard.vue";
import SimpleEntityEventCard from "./SimpleEntityEventCard.vue";
import SaleEventCard from "./SaleEventCard.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  event: Object,
  eventTypes: Object,
});

const store = useStore();

const isSimpleEntity = (entity) => ["User", "Resource"].includes(entity);

const rowsByEntity = {
  User: () => store.getters["users/getAllInformationColumns"],
  Resource: () =>
    store.getters["resources/getColumnsByResource"]?.(
      props.event?.payload?.entityAfter?.clazz,
      true,
    ) || [],
  ReturnResource: () =>
    store.getters["resources/getColumnsByResource"]?.(
      props.event?.payload?.entity?.returnedResource?.clazz,
      true,
    ) || [],
};

const entityType = computed(
  () => props.eventTypes?.[props.event?.type]?.entity,
);

const rows = rowsByEntity[entityType.value]?.() ?? [];
</script>
