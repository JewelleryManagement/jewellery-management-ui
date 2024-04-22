<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
    <user-resource-form @handle-submit="handleSubmit"></user-resource-form>
  </v-container>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
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
  resourceId
);

const handleSubmit = async (inputsData) => {
  const { organizationId, quantity } = inputsData;
  const userId = route.params.userId;
  const data = {
    organizationId: organizationId,
    resourceId: resourceId,
    quantity: Number(quantity),
  };
  try {
    await store.dispatch("organizations/removeResourceFromOrg", data);
    snackbarProvider.showSuccessSnackbar("Successfully removed quantity");
    router.push(`/users/${userId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
