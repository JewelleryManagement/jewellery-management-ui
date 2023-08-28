<template>
  <v-container class="my-12" fluid>
    <v-card class="mx-auto pa-10" width="800" height="auto">
      <template v-slot:title>
        <div class="mx-auto text-center" style="font-size: 24px">
          Add a resource
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
import { ref } from "vue";
import Pearl from "../components/AddResources/Pearl.vue";
import PreciousMetal from "../components/AddResources/PreciousMetal.vue";
import Select from "../components/AddResources/Select.vue";

export default {
  components: {
    Pearl,
    Select,
    PreciousMetal
  },
  setup() {
    const select = ref("");
    const selected = ref("");

    const handleSelectedOption = (newValue) => {
      selected.value = newValue;
    };

    return {
      handleSelectedOption,
      select,
      selected,
    };
  },
};
</script>

<style scoped></style>
