<template>
  <v-select
    label="Select organization"
    :items="items"
    :item-props="orgsPropsFormatter"
    v-model="selectedOrganization"
    required
    :rules="[validateOrgs]"
    :disabled="disabled"
    @update:modelValue="handleChange"
  >
  </v-select>
</template>

<script setup>
import { orgsPropsFormatter } from "@/utils/data-formatter";
import { validateOrgs } from "../../utils/validation-rules";
import { ref, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  selectedValue: {
    type: Object,
    default: () => ({}),
  },
});
const selectedOrganization = ref(props.selectedValue);

const emits = defineEmits(["organization-changed"]);

const handleChange = (value) => {
  emits("organization-changed", value);
};
watch(
  () => props.selectedValue,
  (newOrg) => {
    selectedOrganization.value = newOrg;
  }
);
</script>
