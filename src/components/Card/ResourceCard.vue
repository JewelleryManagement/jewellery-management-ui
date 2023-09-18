<template>
  <v-container>
    <PearlCard
      v-if="resource.clazz === 'Pearl'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndValues="usersAndValues"
    ></PearlCard>
    <LinkingPartCard
      v-if="resource.clazz === 'LinkingPart'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndValues="usersAndValues"
    ></LinkingPartCard>
    <GemstoneCard
      v-if="resource.clazz === 'Gemstone'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndValues="usersAndValues"
    ></GemstoneCard>
    <PreciousMetalCard
      v-if="resource.clazz === 'PreciousMetal'"
      :resource="resource"
      :currentQuantity="currentQuantity"
      :usersAndValues="usersAndValues"
    ></PreciousMetalCard>
  </v-container>
</template>

<script>
import PearlCard from "./ResourceCards/PearlCard.vue";
import LinkingPartCard from "./ResourceCards/LinkingPartCard.vue";
import GemstoneCard from "./ResourceCards/GemstoneCard.vue";
import PreciousMetalCard from "./ResourceCards/PreciousMetalCard.vue";
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

    const usersAndValues = ref([]);

    const calculateUserValues = () => {
      const quantityForAllUsers = props.quantityAndResourceByUser.reduce(
        (total, user) => {
          const userResource = user.resourcesAndQuantities.find(
            (resource) => resource.resource.id === resourceId
          );

          if (userResource) {
            usersAndValues.value.push({
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
      usersAndValues: usersAndValues.value,
    };
  },
};
</script>

<style scoped></style>
