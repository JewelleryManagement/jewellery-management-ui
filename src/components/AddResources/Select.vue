<template>
  <v-select
    v-model="select"
    :items="items"
    label="Item"
    required
    return-object
  ></v-select>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    selectValue: String,
  },
  emits: ["selected-option"],
  setup(props, { emit }) {
    const items = ["Pearl", "PreciousMetal", "Gemstone", "LinkingPart"];
    const select = ref(props.selectValue);

    watch(select, (newValue) => {
      emit("selected-option", newValue);
    });

    return {
      select,
      items,
    };
  },
};
</script>
