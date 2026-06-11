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
import { ref, onMounted } from "vue";
import { useOrganizationsStore } from "@/store/organizations";
import { ORGANIZATION_SALE_CREATE } from "@/utils/permissionConstants";
const props = defineProps({ sellObject: Object, allUsers: Object });
const organizationsStore = useOrganizationsStore();
const allOrgsByUser = ref([]);

onMounted(async () => {
  allOrgsByUser.value = await organizationsStore.fetchUserOrgsByPermission(
    ORGANIZATION_SALE_CREATE,
  );
});

const updateSelectedOrg = (newOrg) => {
  if (newOrg) {
    props.sellObject.seller = newOrg;
  }
};
</script>
