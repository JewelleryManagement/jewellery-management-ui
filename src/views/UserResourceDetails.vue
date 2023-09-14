<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{ pageTitle }}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <v-select
          v-model="selected"
          :items="options"
          label="Select resource type"
        >
        </v-select>

        <v-text-field v-if="selected" label="Quantity"></v-text-field>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed } from "vue";
import Pearl from "../components/Form/Pearl.vue";
import PreciousMetal from "../components/Form/PreciousMetal.vue";
import Gemstone from "../components/Form/Gemstone.vue";
import LinkingPart from "../components/Form/LinkingPart.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    PreciousMetal,
    Gemstone,
    LinkingPart,
  },
  props: {
    id: String,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const pageTitle = ref(route.meta.title);
    const selected = ref("");

    const allResources = computed(() => store.getters["resources/allResources"]);
    const options = ref([]);
    for (const res in allResources.value) {
      options.value.push(allResources.value[res].clazz + " - " + allResources.value[res].id.slice(-12));
    }

    return {
      pageTitle,
      options,
      selected,
    };
  },
};
</script>

<style scoped></style>
