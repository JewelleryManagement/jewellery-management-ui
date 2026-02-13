<template>
  <div class="my-12">
    <organization-card :organization="organization"></organization-card>

    <ToggleTableButtons v-model="selectedButton" :buttons="tableButtons" />

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
            :item="item"
            @disassembled-product="updateOrganizationDetails"
          ></disassembly-button>

          <product-transfer-button
            :product="item"
            @transferred-product="updateOrganizationDetails"
          />
        </div>
      </template>
    </products-table>

    <users-table
      v-if="selectedButton === 'Members'"
      title="Organization members"
      :users="orgMembers"
      :columns="orgUsersColumns"
      :head-btn-path="addUserToOrgPath"
      head-btn-name="Add User"
    >
      <template v-slot:item.permissions="{ item }">
        <PermissionsTooltip :permissions="item.permissions" />
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex align-center ga-2" @click.stop>
          <IconButton
            icon="mdi-pencil"
            name="Edit"
            color="green"
            :routerPath="{
              name: 'Edit-user-in-Organization',
              params: { organizationId: orgId, userId: item.id },
            }"
          />

          <IconButton
            icon="mdi-delete"
            name="Delete"
            color="red"
            @click="onDelete(item.id)"
          />
        </div>
      </template>
    </users-table>

    <EventsTable
      v-if="selectedButton === 'Events'"
      :headers="eventHeaders"
      :items="events"
    >
    </EventsTable>
  </div>
</template>

<script setup>
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import IconButton from "@/components/Button/IconButton.vue";
import PermissionsTooltip from "@/components/Tooltip/PermissionsTooltip.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import OrganizationCard from "@/components/Card/OrganizationCard.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue";
import ToggleTableButtons from "@/components/Button/ToggleTableButtons.vue";
import EventsTable from "@/components/Table/EventsTable.vue";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const snackbarProvider = inject("snackbarProvider");
const organizationResources = ref([]);
const tableColumnsResources = computed(
  () => store.getters["resources/getAvailabilityUpdateColumns"],
);
const orgUsersColumns = computed(
  () => store.getters["users/getOrganizationColumns"],
);
const organization = ref({});
const orgProducts = ref([]);
const orgMembers = ref([]);
const disassemblyColumns = computed(
  () => store.getters["products/getActionsColumn"],
);
const orgId = route.params.organizationId;
const addUserToOrgPath = ref(`/organizations/${orgId}/add-user`);
onMounted(async () => {
  await updateOrganizationDetails();
});

const fetchResourcesForOrganization = async () => {
  try {
    const res = await store.dispatch(
      "organizations/fetchOrganizationResources",
      orgId,
    );
    organization.value = res.owner;
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
  try {
    orgProducts.value = await store
      .dispatch("products/fetchProductsByOrganization", orgId)
      .then((productsResponse) => productsResponse.products);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch products for organization!",
    );
  }
};
const fetchUsersForOrganization = async () => {
  try {
    orgMembers.value = await store
      .dispatch("users/fetchUsersByOrganization", orgId)
      .then((usersResponse) => {
        const formattedUsers = usersResponse.members.map((singleUser) => {
          return {
            ...singleUser.user,
            permissions: singleUser.organizationPermissions,
          };
        });
        return formattedUsers;
      });
  } catch (error) {
    snackbarProvider.showErrorSnackbar(
      "Could not fetch products for organization!",
    );
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
    await store.dispatch("organizations/removeUser", {
      userId: userId,
      orgId: orgId,
    });
    await fetchUsersForOrganization();
  }
};

const selectedButton = ref(null);

const tableButtons = computed(
  () => store.getters["organizations/getTableButtons"],
);

const events = await store.dispatch("systemEvents/getEventsRelatedTo", orgId);

const eventHeaders = computed(() => store.getters["systemEvents/eventHeaders"]);
</script>
