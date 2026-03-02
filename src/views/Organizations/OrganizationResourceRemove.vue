<template>
  <v-container class="my-12" fluid>
    <resource-details-card
      :resourceAvailability="resourceAvailability"
    ></resource-details-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>
  </v-container>
</template>

<script setup>
import { inject, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceDetailsCard from "@/components/Card/ResourceDetailsCard.vue";
import { handleNotFound } from "@/utils/action-guard";
const { resourceId, userId } = defineProps({
  resourceId: String,
  userId: String,
});

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const router = useRouter();
const resourceAvailability = computed(
  () => store.getters["resources/getCurrentAvailability"],
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
    if (await handleNotFound(router, error, "Resource")) return;

    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>
