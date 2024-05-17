<template>
  <v-container class="my-12" fluid>
    <base-card>
      <resource-availability-table
        :tableColumns="tableColumnsResources"
        :resourceItem="organizationDetailsItems"
        :orgName="orgName.name"
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
  </v-container>
</template>

<script setup>
import ResourceAvailabilityTable from "@/components/Table/ResourceAvailabilityTable.vue";
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const snackbarProvider = inject("snackbarProvider");
const organizationDetailsItems = ref([]);
const tableColumnsResources = computed(() => store.getters["users/getColumns"]);
const orgName = ref({});

onMounted(async () => {
  fetchUserOrgs();
  fetchOrganizationDetails();
});

console.log(organizationDetailsItems.value);

const fetchOrganizationDetails = async () => {
  const orgId = route.params.organizationId;

  try {
    const res = await store.dispatch("organizations/fetchOrgsById", orgId);
    orgName.value = res.owner;
    for (const item of res.resourcesAndQuantities) {
      organizationDetailsItems.value.push({
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

const fetchUserOrgs = async () => {
  try {
    await store.dispatch("organizations/fetchUserOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
};
</script>
