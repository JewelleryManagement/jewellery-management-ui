<template>
  <UserInOrganizationForm
    :selectedOrg="selectedOrg"
    v-model:selectedUser="selectedUser"
    v-model:chosenPermissions="selectedUser.permissions"
    :submitRequestFunction="editUserInOrg"
    @update:chosenPermissions="getChosenOptions"
  />
</template>
    
  <script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { computed, ref, reactive, inject, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
const snackbarProvider = inject("snackbarProvider");
const store = useStore();

onMounted(async () => {
  await fetchSelectedUser();
});
const allOrgsByUser = computed(() => store.getters["organizations/getOrgs"]);
const selectedOrg = computed(
  () =>
    (selectedOrg.value = allOrgsByUser.value.filter(
      (x) => x.id === route.params.organizationId
    )[0])
);
const route = useRoute();
const router = useRouter();
const selectedUserId = route.params.userId;
const selectedUser = ref({});
const getChosenOptions = (chosenOptions) => {
  selectedUser.value.permissions = chosenOptions;
};
const editUserInOrg = async () => {
  const data = {
    orgId: selectedOrg.value.id,
    userId: selectedUser.value.id,
    requestBody: {
      organizationPermission: selectedUser.value.permissions,
    },
  };
  try {
    const res = await store.dispatch("organizations/editUserInOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully Edited user in org!");
    router.push(`/organizations/${route.params.organizationId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
const fetchSelectedUser = async () => {
  try {
    let orgMembers = await store
      .dispatch("users/fetchUsersByOrganization", selectedOrg.value.id)
      .then((usersResponse) => {
        const formattedUsers = usersResponse.members.map((singleUser) => {
          return {
            ...singleUser.user,
            permissions: singleUser.organizationPermissions,
          };
        });
        return formattedUsers;
      });
    const selectedUserIndex = orgMembers.findIndex(
      (member) => member.id === selectedUserId
    );
    selectedUser.value = orgMembers[selectedUserIndex];
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch users for organization!"
    );
  }
};
</script>
    
  <style scoped></style>
    