<template>
  <div class="my-12">
    <organization-card :organization="organization"></organization-card>

    <ToggleTableButtons
      v-model="selectedButton"
      :buttons="allowedTableButtons"
    />

    <resource-availability-table
      v-if="selectedButton === 'Resources'"
      :tableColumns="tableColumnsResources"
      :resources="organizationResources"
      :name="organization.name"
    >
      <template v-slot:item.pricePerQuantity="{ item }">
        €{{ item.pricePerQuantity?.toFixed(2) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <IconButton
            v-if="permissionsStore.canDeleteResource(orgId)"
            icon="mdi-minus"
            name="Remove Quantity"
            color="red"
            :routerPath="{
              name: 'Remove-Quantity',
              params: {
                organizationId: orgId,
                resourceId: item?.id,
                quantity: item.quantity,
              },
            }"
          />

          <IconButton
            v-if="permissionsStore.canTransferResource(orgId)"
            icon="mdi-swap-horizontal"
            name="Transfer"
            color="blue"
            :routerPath="{
              name: 'Transfer-Quantity',
              params: {
                organizationId: orgId,
                resourceId: item?.id,
                quantity: item.quantity,
              },
            }"
          />
        </div>
      </template>
    </resource-availability-table>

    <products-table
      v-if="selectedButton === 'Products'"
      :products="orgProducts"
      :additionalColumnsRight="disassemblyColumns"
      :title="`${organization.name}'s products table`"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <disassembly-button
            v-if="permissionsStore.canDisassembleProduct(orgId)"
            :item="item"
            @disassembled-product="updateOrganizationDetails"
          ></disassembly-button>

          <product-transfer-button
            v-if="permissionsStore.canTransferProduct(orgId)"
            :product="item"
            @transferred-product="updateOrganizationDetails"
          />
        </div>
      </template>
    </products-table>

    <users-table
      v-if="selectedButton === 'Members'"
      title="Organization members"
      :users="usersForTable"
      :columns="orgUsersColumns"
      :head-btn-path="addUserToOrgPath"
      :head-btn-name="permissionsStore.canAddUser(orgId) ? 'Add User' : null"
    >
      <template v-slot:item.roles="{ item }">
        <div @click.stop>
          <IconButton
            icon="mdi-shield-account"
            name="Roles"
            color="black"
            @click="openRolesDialog(item.id)"
          />
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <IconButton
            v-if="permissionsStore.canUpdateUser(orgId)"
            icon="mdi-pencil"
            name="Edit"
            color="green"
            :routerPath="{
              name: 'Edit-user-in-Organization',
              params: { organizationId: orgId, userId: item.id },
            }"
          />

          <IconButton
            v-if="permissionsStore.canDeleteUser(orgId)"
            icon="mdi-delete"
            name="Delete"
            color="red"
            @click="onDelete(item.id)"
          />
        </div>
      </template>
    </users-table>

    <RolesDialog v-model="isDialogOpen" :roles="selectedUserRoles" />

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>

    <RolesTable v-if="selectedButton === 'Roles'" :roles="roles" />
  </div>
</template>

<script setup>
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import IconButton from "@/components/Button/IconButton.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import OrganizationCard from "@/components/Card/OrganizationCard.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import RolesTable from "@/components/Table/RolesTable.vue";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { handleNotFound } from "@/utils/action-guard";
import { useUsersStore } from "@/store/users";
import { useOrganizationsStore } from "@/store/organizations";
import { useProductsStore } from "@/store/products";
import { useSystemEventsStore } from "@/store/systemEvents";
import { useResourcesStore } from "@/store/resources";
import { useRolesStore } from "@/store/roles";
import RolesDialog from "@/components/Dialog/RolesDialog.vue";
import ProductTransferButton from "@/components/Button/ProductTransferButton.vue";
import { usePermissionsStore } from "@/store/permissions";

const usersStore = useUsersStore();
const organizationsStore = useOrganizationsStore();
const productsStore = useProductsStore();
const systemEventsStore = useSystemEventsStore();
const resourcesStore = useResourcesStore();
const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();
const route = useRoute();
const router = useRouter();
const snackbarProvider = inject("snackbarProvider");
const organizationResources = ref([]);
const tableColumnsResources = computed(
  () => resourcesStore.getAvailabilityUpdateColumns,
);
const orgUsersColumns = computed(() => usersStore.getOrganizationColumns);
const organization = ref(organizationsStore.selectedOrganization);
const orgProducts = ref([]);
const orgMembers = ref([]);
const usersForTable = ref([]);
const disassemblyColumns = computed(() => [productsStore.tableActions]);
const orgId = route.params.id;
const addUserToOrgPath = ref(`/organizations/${orgId}/add-user`);
const isDialogOpen = ref(false);
const selectedUserRoles = ref([]);
const events = ref([]);
const eventHeaders = computed(() => systemEventsStore.eventHeaders);
const roles = ref([]);
onMounted(async () => {
  await fetchCurrentUserPermissions();
  await updateOrganizationDetails();
  await fetchEventsForOrganization();
  await fetchRolesForOrganization();
});

const fetchResourcesForOrganization = async () => {
  if (!permissionsStore.canReadResource(orgId)) return;

  try {
    const res = await organizationsStore.fetchOrganizationResources(orgId);
    organizationResources.value = [];
    for (const item of res.resourcesAndQuantities) {
      organizationResources.value.push({
        ...item.resource,
        quantity: item.quantity,
      });
    }
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Couldn't fetch the organization details!",
    );
  }
};
const fetchProductsForOrganization = async () => {
  if (!permissionsStore.canReadProduct(orgId)) return;

  try {
    orgProducts.value = await productsStore
      .fetchProductsByOrganization(orgId)
      .then((productsResponse) => productsResponse.products);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch products for organization!",
    );
  }
};
const fetchUsersForOrganization = async () => {
  if (!permissionsStore.canReadUser(orgId)) return;

  try {
    const response = await usersStore.fetchUsersByOrganizationWithRoles(orgId);

    orgMembers.value = response;

    usersForTable.value = response.map((item) => item.user);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch users for organization!",
    );
  }
};

const fetchEventsForOrganization = async () => {
  if (!permissionsStore.canReadEvent(orgId)) return;

  try {
    events.value = await systemEventsStore.fetchEventsRelatedTo(orgId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch events for organization!",
    );
  }
};

const fetchRolesForOrganization = async () => {
  if (!permissionsStore.canReadRole(orgId)) return;

  try {
    roles.value = await rolesStore.fetchAllRolesByType("ORGANIZATION");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch roles for organization!",
    );
  }
};

const fetchCurrentUserPermissions = async () => {
  try {
    await permissionsStore.fetchCurrentUserPermissions(orgId);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch roles for organization!",
    );
    throw error;
  }
};

const updateOrganizationDetails = async (productId) => {
  await fetchProductsForOrganization();
  await fetchResourcesForOrganization();
  await fetchUsersForOrganization();
};
const onDelete = async (userId) => {
  const confirmation = window.confirm(
    "Are you sure that you would like to remove this user from organization?",
  );
  if (confirmation) {
    try {
      await organizationsStore.removeUser({ userId, orgId });
    } catch (error) {
      if (await handleNotFound(router, error, "User")) return;

      console.error("Failed to remove user:", error);
    }
    await fetchUsersForOrganization();
  }
};

const selectedButton = ref(null);

const tableButtons = computed(() => organizationsStore.tableButtons);

const buttonPermissionsMap = organizationsStore.buttonPermissionsMap;

const allowedTableButtons = computed(() => {
  return tableButtons.value.filter((button) => {
    const requiredPermission = buttonPermissionsMap[button.label];

    if (!requiredPermission) return true;

    return permissionsStore.hasPermission(orgId, requiredPermission);
  });
});

const openRolesDialog = (userId) => {
  const member = orgMembers.value.find((item) => item.user.id === userId);

  selectedUserRoles.value = member?.organizationRoles || [];
  isDialogOpen.value = true;
};
</script>
