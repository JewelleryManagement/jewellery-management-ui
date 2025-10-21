<template>
  <v-container class="my-12" fluid>
    <organization-card :organization="organization"></organization-card>
    <base-card>
      <resource-availability-table
        :tableColumns="tableColumnsResources"
        :resourceItem="organizationResources"
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
    </base-card>
    <base-card>
      <products-table
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
    </base-card>
  </v-container>
</template>

<script setup>
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import ProductsTable from "@/components/Table/ProductsTable.vue";
import OrganizationCard from "@/components/Card/OrganizationCard.vue";
import DisassemblyButton from "@/components/Button/DisassemblyButton.vue";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const snackbarProvider = inject("snackbarProvider");
const organizationResources = ref([]);
const tableColumnsResources = computed(() => store.getters["users/getColumns"]);
const organization = ref({});
const orgProducts = ref([]);
const disassemblyColumns = computed(() => [
  store.state.products.tableColumnDisassembly,
  store.state.products.tableColumnTransfer,
]);
const orgId = route.params.organizationId;
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

const updateOrganizationDetails = async (productId) => {
  await fetchProductsForOrganization();
  await fetchResourcesForOrganization();
};
</script>
