<template>
  <v-container class="my-12" fluid>
    <resource-details-card
      :resourceAvailability="resourceAvailability"
    ></resource-details-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>

    <organizations-table
      v-if="organizations?.length"
      :headers="organizationsTableColumns"
      :items="organizations"
      name="Organizations Owning The Resource Table"
    >
      <template v-slot:item.quantity="{ item }">
        {{ getOrganizationQuantity(item) }}
      </template>
    </organizations-table>
  </v-container>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
import { getQuery } from "@/utils/resource-util";
const { resourceId } = defineProps({
  resourceId: String,
});

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const router = useRouter();
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId,
);

onMounted(async () => {
  fetchUserOrg();
});

const fetchUserOrg = async () => {
  try {
    await store.dispatch("organizations/fetchOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
};

const postAddQuantity = async (data) => {
  try {
    await store.dispatch("organizations/postResourceToOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    const query = getQuery(resourceAvailability.value.resource, store);
    router.push({
      path: "/resources",
      query: query,
    });
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async (inputsData) => {
  const { organizationId, quantity, dealPrice } = inputsData;

  const data = {
    organizationId: organizationId,
    resourceId: resourceId,
    quantity: Number(quantity),
    dealPrice: dealPrice,
  };

  postAddQuantity(data);
};

const organizations = computed(() =>
  resourceAvailability.value.organizationsAndQuantities.map((x) => x.owner),
);
const organizationsTableColumns = computed(
  () => store.getters["organizations/getAllColumnsWithQuantityColumn"],
);

const getOrganizationQuantity = (item) => {
  return (
    resourceAvailability.value.organizationsAndQuantities.find(
      (x) => x.owner?.id === item.id,
    )?.quantity ?? 0
  );
};
</script>

<style scoped></style>
