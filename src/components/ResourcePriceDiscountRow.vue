<template>
  <v-row class="mt-4">
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
const name = ref("");

const resourceName = computed(() => {
  const allResources = store.state.resources.resources;
  const matchedResource = allResources.find(resource => resource.id === props.resource.id);
  return matchedResource ? matchedResource.clazz : '';
});

const formattedDiscount = ref(props.resource?.discount !== undefined ? props.resource.discount : 0);

const formattedResourcePrice = computed(() => {
  return props.resource.currentResourcePrice.toFixed(2);
});

onMounted(() => {
  name.value = resourceName.value;
});

watch(formattedDiscount, (newValue, oldValue) => {
  props.resource.discount = newValue;
});
</script>
