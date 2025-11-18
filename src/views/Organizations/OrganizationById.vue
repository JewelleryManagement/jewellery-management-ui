<template>
  <div class="my-12">
    <organization-card :organization="organization"></organization-card>

    <div class="my-12 d-flex flex-wrap justify-center">
      <v-btn
        v-for="button in buttons"
        :key="button.label"
        :prepend-icon="button.icon"
        :class="isMediumAndDownScreen() ? 'mx-2 my-2 ' : 'mx-15'"
        :size="isMediumAndDownScreen() ? 'small' : 'x-large'"
        color="red"
        rounded="xs"
        :variant="selectedButton === button.label ? 'flat' : 'outlined'"
        @click="
          selectedButton === button.label
            ? (selectedButton = null)
            : (selectedButton = button.label)
        "
      >
        {{ getButtonLabel(button.label) }}
      </v-btn>
    </div>

    <resource-availability-table
      v-if="selectedButton === buttons[0].label"
      :tableColumns="tableColumnsResources"
      :resources="organizationResources"
      :name="organization.name"
    >
      <template v-slot:item.remove="{ item }">
        <router-link
          :to="{
            name: 'Remove-Quantity',
            params: { resourceId: item?.id, quantity: item.quantity },
          }"
        >
          <v-icon color="blue">mdi-minus</v-icon>
        </router-link>
      </template>

      <template v-slot:item.transfer="{ item }">
        <router-link
          :to="{
            name: 'Transfer-Quantity',
            params: { resourceId: item?.id, quantity: item.quantity },
          }"
        >
          <v-icon color="#607D8B">mdi-swap-horizontal</v-icon>
        </router-link>
      </template>
    </resource-availability-table>

    <products-table
      v-if="selectedButton === buttons[1].label"
      :products="orgProducts"
      :additionalColumnsRight="disassemblyColumns"
      :title="`${organization.name}'s products table`"
    >
      <template v-slot:item.authors="{ item }">
        <user-tool-tip
          :user="author"
          v-for="(author, index) in item.authors"
          :key="item.id"
          @click.stop
        >
          <template v-if="index < item.authors.length - 1"
            >&comma;&nbsp;</template
          >
        </user-tool-tip>
      </template>

      <template v-slot:item.disassembly="{ item }">
        <disassembly-button
          :item="item"
          @disassembled-product="updateOrganizationDetails"
          @click.stop
        ></disassembly-button>
      </template>

      <template v-slot:item.transfer="{ item }">
        <product-transfer-button
          :product="item"
          @transferred-product="updateOrganizationDetails"
        />
      </template>
    </products-table>

    <users-table
      v-if="selectedButton === buttons[2].label"
      title="Organization members"
      :users="orgMembers"
      :columns="orgUsersColumns"
      :head-btn-path="addUserToOrgPath"
      head-btn-name="Add User"
    >
      <template v-slot:item.permissions="{ item }">
        <PermissionsTooltip :permissions="item.permissions" />
      </template>
      <template v-slot:item.edit="{ item }">
        <EditButton
          :routerPath="{
            name: 'Edit-user-in-Organization',
            params: { organizationId: orgId, userId: item.id },
          }"
        />
      </template>
      <template v-slot:item.delete="{ item }">
        <v-icon color="red" @click.stop @click="onDelete(item.id)"
          >mdi-delete</v-icon
        >
      </template>
    </users-table>
  </div>
</template>

<script setup>
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import UsersTable from "@/components/Table/UsersTable.vue";
import EditButton from "@/components/Button/EditButton.vue";
import PermissionsTooltip from "@/components/Tooltip/PermissionsTooltip.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import OrganizationCard from "@/components/Card/OrganizationCard.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { isMediumAndDownScreen } from "@/utils/display";

const store = useStore();
const route = useRoute();
const snackbarProvider = inject("snackbarProvider");
const organizationResources = ref([]);
const tableColumnsResources = computed(
  () => store.getters["resources/getAvailabilityUpdateColumns"]
);
const orgUsersColumns = computed(
  () => store.getters["users/getOrganizationColumns"]
);
const organization = ref({});
const orgProducts = ref([]);
const orgMembers = ref([]);
const disassemblyColumns = computed(() => [
  store.state.products.tableColumnDisassembly,
  store.state.products.tableColumnTransfer,
]);
const orgId = route.params.organizationId;
const addUserToOrgPath = ref(`/organizations/${orgId}/add-user`);
onMounted(async () => {
  await updateOrganizationDetails();
});

const fetchResourcesForOrganization = async () => {
  try {
    const res = await store.dispatch(
      "organizations/fetchOrganizationResources",
      orgId
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
      "Couldn't fetch the organization details!"
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
      "Could not fetch products for organization!"
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
      "Could not fetch products for organization!"
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
    "Are you sure that you would like to remove this user from organization?"
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

const buttons = [
  { label: "Resources", icon: "mdi-diamond-stone" },
  { label: "Products", icon: "mdi-package-variant" },
  {
    label: "Members",
    icon: "mdi-account-multiple",
  },
];

const getButtonLabel = (label) => {
  return label + (!isMediumAndDownScreen() ? " Table" : "");
};
</script>
