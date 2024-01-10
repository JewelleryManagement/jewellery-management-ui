<template>
  <v-container class="my-12" fluid>
    <resource-availability-card
      :resourceAvailability="resourceAvailability"
    ></resource-availability-card>

    <user-resource-form @handle-submit="handleSubmit" />
  </v-container>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ResourceAvailabilityCard from "@/components/Card/ResourceAvailabilityCard.vue";
const { resourceId, userId } = defineProps({
  resourceId: String,
  userId: String,
});
const snackbarProvider = inject("snackbarProvider");
const store = useStore();
const router = useRouter();
const resourceAvailability = ref({});
resourceAvailability.value = await store.dispatch(
  "resources/fetchAvailabilityResourceById",
  resourceId
);

const postAddQuantity = async (data) => {
  try {
    await store.dispatch("users/postResourcesToUser", data);
    snackbarProvider.showSuccessSnackbar("Successfully added quantity!");
    router.push("/resources");
  } catch (error) {
    snackbarProvider.showErrorSnackbar(error?.response?.data?.error);
  }
};

const handleSubmit = async (inputsData) => {
  const { userId, quantity, dealPrice } = inputsData;
  const data = {
    userId: userId,
    resourceId: resourceId,
    quantity: Number(quantity),
    dealPrice: dealPrice
  };

  postAddQuantity(data);
};
</script>

<style scoped></style>
