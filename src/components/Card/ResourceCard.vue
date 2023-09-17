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
  props: ["resource", "currentQuantity", "emptyArr"],
  setup(props) {
    let quantityForAllUsers = 0
    const usersAndValues = ref([])

    for (const key in props.emptyArr) {
      
      for (const key2 in props.emptyArr[key].resourcesAndQuantities) {
        if (props.emptyArr[key].resourcesAndQuantities[key2].resource.id === props.resource.id) {
          quantityForAllUsers +=props.emptyArr[key].resourcesAndQuantities[key2].quantity
          usersAndValues.value.push({
            name: props.emptyArr[key].owner.name,
            quantity: props.emptyArr[key].resourcesAndQuantities[key2].quantity,
          })
        }
      }

    }
    return {
      resource: props.resource,
      currentQuantity: quantityForAllUsers,
      emotyArr: props.emptyArr,
      usersAndValues: usersAndValues.value
    };
  },
};
</script>

<style scoped></style>
