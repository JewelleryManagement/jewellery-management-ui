<template>
  <v-container class="my-12" fluid>
    <resource-details-card
      :resourceAvailability="resourceAvailability"
    ></resource-details-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>
  </v-container>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";
const { resourceId, userId } = defineProps({
  resourceId: String,
  userId: String,
});

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId,
);

const handleSubmit = async (inputsData) => {
  const { organizationId, quantity } = inputsData;

  const data = {
    organizationId: organizationId,
    resourceId: resourceId,
    quantity: Number(quantity),
  };

  await postRemoveResource(organizationId, data);
};

const postRemoveResource = async (organizationId, data) => {
  try {
    await store.dispatch("organizations/removeResourceFromOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully removed quantity");
    router.push(`/organizations/${organizationId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>
