<template>
  <OrganizationSelect
    :selectedValue="props.sellObject.seller"
    :items="allOrgsByUser"
    @organization-changed="updateSelectedOrg"
  />

  <v-select
    v-model="props.sellObject.buyer"
    label="Buyer"
    :items="props.allUsers"
    :item-props="userPropsFormatter"
    :rules="[validateAuthors(props.sellObject.buyer)]"
  >
  </v-select>
</template>

<script setup>
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";
import { userPropsFormatter } from "@/utils/data-formatter.js";
import { validateAuthors } from "@/utils/validation-rules";
import { ref, computed } from "vue";
import { useStore } from "vuex";
const props = defineProps({ sellObject: Object, allUsers: Object });
const store = useStore();
const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const updateSelectedOrg = (newOrg) => {
  if (newOrg) {
    props.sellObject.seller = newOrg;
  }
};
</script>
