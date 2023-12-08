<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>
    <user-resource-form @handle-submit="handleSubmit"></user-resource-form>
  </v-container>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";

const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const route = useRoute();
const router = useRouter();
const resourceId = route.params.resourceId;
const userId = route.params.userId;
const allUsers = computed(() => store.getters["users/allUsers"]);

const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);

const handleSubmit = async (inputsData) => {
  const { selectedUserEmail, quantity } = inputsData;
  const selectedNewOwner = allUsers.value.find(
    (user) => user.email == selectedUserEmail
  );

  const data = {
    previousOwnerId: userId,
    newOwnerId: selectedNewOwner.id,
    transferredResourceId: resourceId,
    quantity: Number(quantity),
  };

  try {
    await store.dispatch("resources/resourceAvailabilityTransfer", data);
    snackbarProvider.showSuccessSnackbar("Successfully transfered!");
    router.push(`/users/${userId}`);
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};
</script>

<style scoped></style>
