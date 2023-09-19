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
import { ref } from "vue";

export default {
  components: {
    PearlCard,
    LinkingPartCard,
    GemstoneCard,
    PreciousMetalCard,
  },
  props: ["resource", "quantityAndResourceByUser"],
  setup(props) {
    const resourceId = props.resource.id;

    const usersAndQuantities = ref([]);

    const calculateUserValues = () => {
      const quantityForAllUsers = props.quantityAndResourceByUser.reduce(
        (total, user) => {
          const userResource = user.resourcesAndQuantities.find(
            (resource) => resource.resource.id === resourceId
          );

          if (userResource) {
            usersAndQuantities.value.push({
              name: user.owner.name,
              quantity: userResource.quantity,
            });
            return total + userResource.quantity;
          }

          return total;
        },
        0
      );

      return quantityForAllUsers;
    };

    const currentQuantity = calculateUserValues();

    return {
      resource: props.resource,
      currentQuantity,
      usersAndQuantities: usersAndQuantities.value,
    };
  },
};
</script>

<style scoped></style>
