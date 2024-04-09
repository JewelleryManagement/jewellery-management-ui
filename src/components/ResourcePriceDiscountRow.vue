<template>
  <v-row class="mt-4">
     <slot> </slot> 

    <v-col cols="8" class="pa-0">
      <v-text-field
        prefix="€"
        :label="`${props.resource.quantity} quantities of ${resourceName}`"
        v-model="formattedResourcePrice"
        readonly
        step="0.01"
      ></v-text-field>
    </v-col>
    <v-divider vertical style="height: 3.5rem"></v-divider>
    <v-col cols="4" class="pa-0">
      <v-text-field
        suffix="%"
        label="Discount"
        v-model="formattedDiscount"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({ resource: Object });

const resourceName = computed(() => {
  const allResources = store.state.resources.resources;
  const matchedResource = allResources.find(
    (resource) => resource.id === props.resource.id
  );
  return matchedResource ? matchedResource.clazz : "";
});

const formattedDiscount = computed({
  get: () => (props.resource?.discount !== null ? props.resource.discount : 0),
  set: (value) => (props.resource.discount = value),
});
const formattedResourcePrice = computed(() => {
  return props.resource.currentResourcePrice.toFixed(2);
});

// watch(formattedDiscount, (newValue, oldValue) => {
//   props.resource.discount = newValue;
//   console.log(props.resource.discount);
// });
</script>
