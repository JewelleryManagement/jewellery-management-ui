<template>
  <UserInOrganizationForm
    :selectedOrg="selectedOrg"
    v-model:selectedUser="selectedUser"
    :submitRequestFunction="addUserToOrg"
    @update:chosenPermissions="getChosenOptions"
  />
</template>
  
<script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { computed, ref, inject, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const selectedOrg = computed(
  () =>
    (selectedOrg.value = allOrgsByUser.value.filter(
      (x) => x.id === route.params.organizationId
    )[0])
);
const selectedPermissions = ref([]);
const selectedUser = ref({});
const route = useRoute();
const router = useRouter();
const getChosenOptions = (chosenOptions) => {
  selectedPermissions.value = chosenOptions;
};
const addUserToOrg = async () => {
  const requestBody = {
    userId: selectedUser.value.id,
    organizationPermission: selectedPermissions.value,
  };

  const data = {
    orgId: selectedOrg.value.id,
    requestBody: requestBody,
  };
  try {
    const res = await store.dispatch("organizations/addUserToOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully added user to org!");
    router.push(`/organizations/${route.params.organizationId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
</script>
  
<style scoped></style>
  