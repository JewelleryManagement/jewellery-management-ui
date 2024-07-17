<template>
  <v-sheet width="300" class="mx-auto">
    <OrganizationSelect
      :items="allOrgsByUser"
      :selectedValue="selectedOrg"
      @organization-changed="updateSelectedOrg"
      :disabled="isInEditView"
    />
    <div>
      <v-checkbox
        v-for="permission in allPermissions"
        :key="permission"
        v-model="chosenPermissions"
        :label="permission"
        :value="permission"
      ></v-checkbox>
    </div>
  </v-sheet>
</template>
  
  <script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import OrganizationSelect from "@/components/Select/OrganizationSelect.vue";
const props = defineProps({
  chosenPermissions: {
    type: Array,
    default: () => [],
  },
});
const selectedOrg = ref("");
const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const chosenPermissions = ref([...props.chosenPermissions]);
watch(chosenPermissions, (newPermissions, oldPermissions) => {
  console.log("Updated Permissions:", newPermissions);
  console.log("Old Permissions:", oldPermissions);
});

const store = useStore();
const allPermissions = computed(
  () => store.getters["organizations/getUserPermissions"]
);
console.log(allPermissions.value);
const updateSelectedOrg = (newOrg) => {
  if (newOrg) {
    selectedOrg.value = newOrg;
  }
};
</script>
  
  <style lang="scss" scoped></style>
  