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

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceId = route.params.resourceId;
const ownerId = route.params.userId;

const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);

const postQuantityTransfer = async (data) => {
  try {
    await store.dispatch("resources/resourceAvailabilityTransfer", data);
    snackbarProvider.showSuccessSnackbar("Successfully transfered!");
    router.push(`/users/${ownerId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
}

const handleSubmit = async (inputsData) => {
  const { userId, quantity } = inputsData;
 
  const data = {
    previousOwnerId: ownerId,
    newOwnerId: userId,
    transferredResourceId: resourceId,
    quantity: Number(quantity),
  };

  postQuantityTransfer(data)

};
</script>

<style scoped></style>
