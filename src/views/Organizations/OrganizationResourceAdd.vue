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
import { inject, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";
import OrganizationsTable from "@/components/Table/OrganizationsTable.vue";
import { getQuery } from "@/utils/resource-util";
import { handleNotFound } from "@/utils/action-guard";
import { useOrganizationsStore } from "@/store/organizations";
import { useResourcesStore } from "@/store/resources";
import OrganizationResourceForm from "@/components/Form/OrganizationResourceForm.vue";
const { id } = defineProps({
  id: String,
});

const snackbarProvider = inject("snackbarProvider");
const organizationsStore = useOrganizationsStore();
const resourcesStore = useResourcesStore();
const router = useRouter();
const resourceAvailability = computed(() => resourcesStore.currentAvailability);

const postAddQuantity = async (data) => {
  try {
    await organizationsStore.postResourceToOrg(data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    const query = getQuery(resourceAvailability.value.resource, resourcesStore);
    router.push({
      path: "/resources",
      query: query,
    });
  } catch (error) {
    if (await handleNotFound(router, error, "Resource")) return;

    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async (inputsData) => {
  const { organizationId, quantity, dealPrice } = inputsData;

  const data = {
    organizationId: organizationId,
    resourceId: id,
    quantity: Number(quantity),
    dealPrice: dealPrice,
  };

  postAddQuantity(data);
};

const organizations = computed(() =>
  resourceAvailability.value.organizationsAndQuantities.map((x) => x.owner),
);
const organizationsTableColumns = computed(
  () => organizationsStore.getAllColumnsWithQuantityColumn,
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
