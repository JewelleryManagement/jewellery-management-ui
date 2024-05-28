<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
    <org-resource-form @handle-submit="handleSubmit"></org-resource-form>
  </v-container>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceId = route.params.resourceId;
const organizationId = route.params.organizationId;
const organizationName = ref("");
const allOrgsByUser = computed(
  () => store.getters["organizations/getUserOrgs"]
);
onMounted(async () => {
  fetchUserOrgs();
  console.log(allOrgsByUser.value);
});
const fetchUserOrgs = async () => {
  try {
    await store.dispatch("organizations/fetchUserOrgs");
  } catch (error) {
    snackbarProvider.showErrorSnackbar("Could not fetch user's organizations");
  }
};

const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
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
