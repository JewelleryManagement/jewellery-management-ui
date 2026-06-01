<template>
  <UserInOrganizationForm
    v-if="selectedOrg"
    :selectedOrg="selectedOrg"
    v-model:selectedUser="selectedUser"
    v-model:selectedRoles="selectedRoles"
    :submitRequestFunction="addUserToOrg"
  />
</template>

<script setup>
import UserInOrganizationForm from "@/components/Form/UserInOrganizationForm.vue";
import { computed, ref, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrganizationsStore } from "@/store/organizations";
import { ORGANIZATION_USER_ADD } from "@/utils/permissionConstants";
const snackbarProvider = inject("snackbarProvider");
const organizationsStore = useOrganizationsStore();
const allOrgsByUser = ref([]);

const selectedUser = ref({});
const route = useRoute();
const router = useRouter();
const selectedRoles = ref([]);

const selectedOrg = computed(() =>
  allOrgsByUser.value.find((x) => x.id === route.params.organizationId),
);

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

onMounted(
  async () =>
    (allOrgsByUser.value = await organizationsStore.fetchUserOrgsByPermission(
      ORGANIZATION_USER_ADD,
    )),
);
</script>

<style scoped></style>
