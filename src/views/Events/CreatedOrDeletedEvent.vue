<template>
  <SimpleEntityEventCard
    v-if="isSimpleEntity(entityType)"
    :entity="event.payload.entity"
    :rows="rows"
  />
  <ProductEventCard
    v-else-if="entityType === 'Product'"
    :entity="event.payload.entity.products[0]"
    :organization="event.payload.entity.organization"
  />
  <UserInOrganizationEventCard
    v-else-if="entityType === 'UserInOrganization'"
    :entity="event.payload.entity"
  />
  <ResourceTransferEventCard
    v-else-if="entityType === 'ResourceTransfer'"
    :entity="event.payload.entity"
  />
  <SaleEventCard
    v-else-if="entityType === 'Sale'"
    :sale="event.payload.entity"
  />
</template>

<script setup>
import ProductEventCard from "./ProductEventCard.vue";
import UserInOrganizationEventCard from "./UserInOrganizationEventCard.vue";
import ResourceTransferEventCard from "./ResourceTransferEventCard.vue";
import SaleEventCard from "./SaleEventCard.vue";
import SimpleEntityEventCard from "./SimpleEntityEventCard.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  event: Object,
  eventTypes: Object,
});

const store = useStore();

const columnGettersMap = {
  Element: "resources/getColumnsForElement",
  Pearl: "resources/getColumnsForPearl",
  Metal: "resources/getColumnsForMetal",
  Diamond: "resources/getColumnsForDiamond",
  DiamondMelee: "resources/getColumnsForDiamondMelee",
  ColoredStone: "resources/getColumnsForColoredStone",
  ColoredStoneMelee: "resources/getColumnsForColoredStoneMelee",
  SemiPreciousStone: "resources/getColumnsForSemiPreciousStone",
};

const isSimpleEntity = (entity) =>
  ["User", "Resource", "Organization"].includes(entity);

const entityType = computed(
  () => props.eventTypes?.[props.event?.type]?.entity,
);

const rowsResolvers = {
  User: () => store.getters["users/getAllInformationColumns"],
  Organization: () => store.getters["organizations/getColumns"],
  Resource: () => {
    const clazz = props.event?.payload?.entity?.clazz;
    const getterKey = columnGettersMap[clazz];
    const getter = getterKey ? store.getters[getterKey] : null;
    return typeof getter === "function" ? getter(true) : [];
  },
};

const rows = computed(() => rowsResolvers[entityType.value]?.() ?? []);
</script>
