<template>
  <UserInOrganizationForm
    :selectedOrg="selectedOrg"
    v-model:selectedUser="selectedUser"
    v-model:selectedRoles="selectedRoles"
    :submitRequestFunction="editUserInOrg"
  />
</template>

<script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { computed, ref, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { handleNotFound } from "@/utils/action-guard";
import { useUsersStore } from "@/store/users";
import { useOrganizationsStore } from "@/store/organizations";
const snackbarProvider = inject("snackbarProvider");
const organizationsStore = useOrganizationsStore();
const usersStore = useUsersStore();

onMounted(async () => {
  await fetchSelectedUser();
});
const allOrgsByUser = computed(() => organizationsStore.organizations);
const selectedOrg = computed(
  () =>
    (selectedOrg.value = allOrgsByUser.value.filter(
      (x) => x.id === route.params.organizationId,
    )[0]),
);
const route = useRoute();
const router = useRouter();
const selectedUserId = route.params.userId;
const selectedUser = ref({});
const selectedRoles = ref([]);

const editUserInOrg = async () => {
  const data = {
    orgId: selectedOrg.value.id,
    userId: selectedUser.value.id,
    requestBody: {
      organizationRoles: selectedRoles.value.map((role) => role.id),
    },
  };
  try {
    await organizationsStore.editUserInOrg(data);
    snackbarProvider.showSuccessSnackbar("Successfully Edited user in org!");
    router.push(`/organizations/${route.params.organizationId}`);
  } catch (error) {
    if (await handleNotFound(router, error, "User")) return;
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
  return false;
};
const fetchSelectedUser = async () => {
  try {
    let orgMembers = await usersStore.fetchUsersByOrganizationWithRoles(
      selectedOrg.value.id,
    );
    const selectedUserIndex = orgMembers.findIndex(
      (member) => member.user.id === selectedUserId,
    );
    selectedUser.value = orgMembers[selectedUserIndex]?.user;
    selectedRoles.value = orgMembers[selectedUserIndex]?.roles;
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch users for organization!",
    );
  }
};
</script>

<style scoped></style>
