<template>
  <UserInOrganizationForm
    :selectedOrg="selectedOrg"
    v-model:selectedUser="selectedUser"
    v-model:selectedRoles="selectedRoles"
    :submitRequestFunction="addUserToOrg"
  />
</template>

<script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { computed, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrganizationsStore } from "@/store/organizations";
const snackbarProvider = inject("snackbarProvider");
const organizationsStore = useOrganizationsStore();
const allOrgsByUser = computed(() => organizationsStore.organizations);
const selectedOrg = computed(() =>
  allOrgsByUser.value.find((x) => x.id === route.params.organizationId),
);

const selectedUser = ref({});
const route = useRoute();
const router = useRouter();
const selectedRoles = ref([]);

const addUserToOrg = async ({ organization, user, roles, canAssignRoles }) => {
  try {
    if (canAssignRoles) {
      await organizationsStore.addUserToOrgWithRoles({
        orgId: organization.id,
        requestBody: {
          userId: user.id,
          organizationRoles: roles.map((role) => role.id),
        },
      });
    } else {
      await organizationsStore.addUserToOrg(organization.id, user.id);
    }

    snackbarProvider.showSuccessSnackbar("Successfully added user to org!");
    router.push(`/organizations/${route.params.organizationId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
