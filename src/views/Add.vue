<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          {{pageTitle}}
        </div>
      </template>

      <v-sheet width="300" class="mx-auto">
        <Select
          :select-value="select"
          @selected-option="handleSelectedOption"
        />
        <Pearl
          v-if="selected === 'Pearl'"
        />
        <PreciousMetal
          v-if="selected === 'PreciousMetal'"
        />
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed, onMounted  } from "vue";
import Pearl from "../components/AddResources/Pearl.vue";
import PreciousMetal from "../components/AddResources/PreciousMetal.vue";
import Select from "../components/AddResources/Select.vue";
import { useRoute, useRouter } from 'vue-router';
import { useStore } from "vuex";

export default {
  components: {
    Pearl,
    Select,
    PreciousMetal
  },
  props: {
    id: String || Number
  },
  setup(props) {
    const store = useStore()

    const select = ref("");
    const selected = ref("");
    const route = useRoute();
    // const router = useRouter();
    const pageTitle = ref(route.meta.title)
    const asd = computed(() => store.getters["resources/getResourceById"](props.id));

    console.log(asd);
  
    
    const handleSelectedOption = (newValue) => {
      selected.value = newValue;
    };

    return {
      pageTitle,
      handleSelectedOption,
      select,
      selected,
    };
  },
};
</script>

<style scoped></style>
