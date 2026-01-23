<template>
  <v-container class="my-12" fluid>
    <resource-details-card
      :resourceAvailability="resourceAvailability"
    ></resource-details-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>
  </v-container>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceId = route.params.resourceId;
const organizationId = route.params.organizationId;
onMounted(async () => {
  fetchUserOrgs();
});
const fetchUserOrgs = async () => {
  try {
    await store.dispatch("organizations/fetchOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
};

const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId,
);

const postQuantityTransfer = async (data) => {
  try {
    await store.dispatch("organizations/transferResourceFromOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully transfered!");
    router.push(`/organizations/${organizationId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async (inputsData) => {
  const { organizationId: newOwnerId, quantity } = inputsData;

  const data = {
    previousOwnerId: organizationId,
    newOwnerId: newOwnerId,
    transferredResourceId: resourceId,
    quantity: Number(quantity),
  };

  postQuantityTransfer(data);
};
</script>

<style scoped></style>
