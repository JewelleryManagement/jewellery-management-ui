<template>
  <v-container>
    <PearlCard
      v-if="resource.clazz === 'Pearl'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndQuantities="usersAndQuantities"
    ></PearlCard>
    <LinkingPartCard
      v-if="resource.clazz === 'LinkingPart'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndQuantities="usersAndQuantities"
    ></LinkingPartCard>
    <GemstoneCard
      v-if="resource.clazz === 'Gemstone'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndQuantities="usersAndQuantities"
    ></GemstoneCard>
    <PreciousMetalCard
      v-if="resource.clazz === 'PreciousMetal'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndQuantities="usersAndQuantities"
    ></PreciousMetalCard>
  </v-container>
</template>

<script>
import PearlCard from "./ResourceAvailabilityCards/PearlCard.vue";
import LinkingPartCard from "./ResourceAvailabilityCards/LinkingPartCard.vue";
import GemstoneCard from "./ResourceAvailabilityCards/GemstoneCard.vue";
import PreciousMetalCard from "./ResourceAvailabilityCards/PreciousMetalCard.vue";

export default {
  components: {
    PearlCard,
    LinkingPartCard,
    GemstoneCard,
    PreciousMetalCard,
  },
  props: ["resource", 'resourceAvailability', 'resourceQuantity'],
  
  setup(props) {

    return {
      resourceQuantity: props.resourceQuantity,
      resource: props.resourceAvailability.resource,
      currentQuantity: props.resourceQuantity.quantity,
      usersAndQuantities: props.resourceAvailability.usersAndQuantities,
    };
  },
};
</script>

<style scoped></style>
