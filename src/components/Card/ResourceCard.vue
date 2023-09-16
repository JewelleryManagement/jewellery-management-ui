<template>
  <v-container>
    <PearlCard
      v-if="resource.clazz === 'Pearl'"
      :resource="resource"
      :currentQuantity="currentQuantity"
    ></PearlCard>
    <LinkingPartCard
      v-if="resource.clazz === 'LinkingPart'"
      :resource="resource"
      :currentQuantity="currentQuantity"
    ></LinkingPartCard>
    <GemstoneCard
      v-if="resource.clazz === 'Gemstone'"
      :resource="resource"
      :currentQuantity="currentQuantity"
    ></GemstoneCard>
    <PreciousMetalCard
      v-if="resource.clazz === 'PreciousMetal'"
      :resource="resource"
      :currentQuantity="currentQuantity"
    ></PreciousMetalCard>
  </v-container>
</template>

<script>
import PearlCard from "./ResourceCards/PearlCard.vue";
import LinkingPartCard from "./ResourceCards/LinkingPartCard.vue";
import GemstoneCard from "./ResourceCards/GemstoneCard.vue";
import PreciousMetalCard from "./ResourceCards/PreciousMetalCard.vue";

export default {
  components: {
    PearlCard,
    LinkingPartCard,
    GemstoneCard,
    PreciousMetalCard,
  },
  props: ["resource", "currentQuantity"],
  setup(props) {
    return {
      resource: props.resource,
      currentQuantity: props.currentQuantity,
    };
  },
};
</script>

<style scoped></style>
